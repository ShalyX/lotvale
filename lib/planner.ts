import {
  projectSchema,
  isoToday,
  type Project,
  type Quote,
  type Item,
  type Offer,
} from "./schema.ts";
export type Allocation = {
  item: Item;
  quote: Quote;
  offer: Offer;
  packs: number;
  units: number;
  subtotalCents: number;
};
export type SupplierOrder = {
  quote: Quote;
  lines: Allocation[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};
export type Plan = {
  id: string;
  allocations: Allocation[];
  orders: SupplierOrder[];
  totalCents: number;
  deliveryDate: string;
  supplierCount: number;
  surplusUnits: number;
};
export type Exclusion = {
  quoteId: string;
  supplier: string;
  reasons: string[];
};
export type PlanningResult = {
  plans: Plan[];
  exclusions: Exclusion[];
  issues: string[];
  evaluated: number;
  baselineCents: number | null;
  baselineLate: boolean;
  lowestUnconstrained: Plan | null;
  minimumTotalCents: number | null;
};
export function quoteIssues(
  q: Quote,
  p: Project,
  today = isoToday(),
): string[] {
  const issues: string[] = [];
  if (!q.confirmed) issues.push("Terms need review");
  if (q.currency !== p.currency)
    issues.push(`Currency is ${q.currency}, purchase is ${p.currency}`);
  if (q.shippingCents === null) issues.push("Freight is not confirmed");
  if (q.taxBps === null) issues.push("Tax is not confirmed");
  if (q.minOrderCents === null) issues.push("Order minimum is not confirmed");
  if (!q.validUntil) issues.push("Quote validity is not confirmed");
  else if (q.validUntil < today) issues.push("Quote has expired");
  if (!q.deliveryDate) issues.push("Delivery date is not confirmed");
  else if (q.deliveryDate > p.deadline)
    issues.push("Arrives after your deadline");
  else if (q.deliveryDate < today) issues.push("Delivery date has passed");
  return issues;
}
function makePlan(lines: Allocation[]): Plan | null {
  const grouped = new Map<string, Allocation[]>();
  for (const l of lines)
    grouped.set(l.quote.id, [...(grouped.get(l.quote.id) || []), l]);
  const orders: SupplierOrder[] = [];
  for (const [, group] of grouped) {
    const quote = group[0].quote;
    const subtotalCents = group.reduce((s, l) => s + l.subtotalCents, 0);
    if (
      quote.minOrderCents === null ||
      subtotalCents < quote.minOrderCents ||
      quote.shippingCents === null ||
      quote.taxBps === null ||
      !quote.deliveryDate
    )
      return null;
    const shippingCents = quote.shippingCents;
    const taxCents = Math.round(
      ((subtotalCents + shippingCents) * quote.taxBps) / 10000,
    );
    orders.push({
      quote,
      lines: group,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents: subtotalCents + shippingCents + taxCents,
    });
  }
  orders.sort((a, b) => a.quote.supplier.localeCompare(b.quote.supplier));
  return {
    id: lines.map((l) => l.quote.id).join("|"),
    allocations: lines,
    orders,
    totalCents: orders.reduce((s, o) => s + o.totalCents, 0),
    deliveryDate: orders
      .map((o) => o.quote.deliveryDate!)
      .sort()
      .at(-1)!,
    supplierCount: orders.length,
    surplusUnits: lines.reduce((s, l) => s + l.units - l.item.quantity, 0),
  };
}
function allocation(item: Item, quote: Quote, offer: Offer): Allocation {
  const packs = Math.max(
    offer.minPacks,
    Math.ceil(item.quantity / offer.packSize),
  );
  return {
    item,
    quote,
    offer,
    packs,
    units: packs * offer.packSize,
    subtotalCents: packs * offer.priceCents,
  };
}
export function buildPlans(input: Project, today = isoToday()): PlanningResult {
  const valid = projectSchema.safeParse(input);
  const result: PlanningResult = {
    plans: [],
    exclusions: [],
    issues: [],
    evaluated: 0,
    baselineCents: null,
    baselineLate: false,
    lowestUnconstrained: null,
    minimumTotalCents: null,
  };
  if (!valid.success) {
    result.issues = ["Check your purchase and quote fields before planning."];
    return result;
  }
  const p = valid.data;
  if (!p.items.length) {
    result.issues = ["Add at least one item to your purchase."];
    return result;
  }
  if (p.deadline < today) {
    result.issues = ["Choose a deadline from today onward."];
    return result;
  }
  const eligible = p.quotes.filter((q) => {
    const reasons = quoteIssues(q, p, today);
    if (reasons.length)
      result.exclusions.push({ quoteId: q.id, supplier: q.supplier, reasons });
    return !reasons.length;
  });
  // The price-only reference ignores pack minimums, freight, tax, validity and timing.
  const reference = p.items.map((item) => {
    const options = p.quotes
      .filter((q) => q.currency === p.currency)
      .flatMap((q) =>
        q.offers
          .filter((o) => o.itemId === item.id)
          .map((o) => ({
            q,
            o,
            cost: Math.ceil(item.quantity / o.packSize) * o.priceCents,
          })),
      )
      .sort((a, b) => a.cost - b.cost);
    return options[0];
  });
  if (reference.every(Boolean)) {
    result.baselineCents = reference.reduce((s, r) => s + r.cost, 0);
    result.baselineLate = reference.some(
      (r) => r.q.deliveryDate !== null && r.q.deliveryDate > p.deadline,
    );
  }
  const options = p.items.map((item) =>
    eligible.flatMap((q) =>
      q.offers
        .filter((o) => o.itemId === item.id)
        .map((o) => allocation(item, q, o)),
    ),
  );
  for (let i = 0; i < options.length; i++)
    if (!options[i].length)
      result.issues.push(`No eligible offer covers ${p.items[i].name}.`);
  if (result.issues.length) return result;
  const all: Plan[] = [];
  const walk = (index: number, lines: Allocation[]) => {
    if (index === p.items.length) {
      result.evaluated++;
      const plan = makePlan(lines);
      if (plan) all.push(plan);
      return;
    }
    for (const l of options[index]) walk(index + 1, [...lines, l]);
  };
  walk(0, []);
  all.sort(
    (a, b) =>
      a.totalCents - b.totalCents ||
      a.supplierCount - b.supplierCount ||
      a.deliveryDate.localeCompare(b.deliveryDate) ||
      a.id.localeCompare(b.id),
  );
  result.minimumTotalCents = all[0]?.totalCents ?? null;
  result.lowestUnconstrained = all[0] ?? null;
  result.plans = all.filter((pn) => pn.totalCents <= p.budgetCents);
  if (!all.length)
    result.issues.push(
      "No complete basket meets the suppliers’ merchandise minimums. Review order minimums or add a suitable quote.",
    );
  else if (!result.plans.length)
    result.issues.push(
      "Complete baskets exist, but all exceed your budget. Review the lowest total and adjust your requirements or quotes.",
    );
  return result;
}
