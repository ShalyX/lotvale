import test from "node:test";
import assert from "node:assert/strict";
import { buildPlans } from "./planner.ts";
import { sampleProject } from "./sample.ts";
import { datePlus, isoToday, projectSchema } from "./schema.ts";
import { orderText, planCsv } from "./exports.ts";

test("sample selects the hand-calculated complete order and excludes late low prices", () => {
  const p = sampleProject();
  const r = buildPlans(p);
  assert.equal(r.plans[0].totalCents, 75508);
  assert.equal(r.plans[0].supplierCount, 1);
  assert.equal(r.plans[0].orders[0].quote.id, "counter");
  assert.equal(r.plans[0].orders[0].subtotalCents, 67440);
  assert.equal(r.plans[0].orders[0].taxCents, 5268);
  assert.equal(r.baselineCents, 54000);
  assert.equal(r.baselineLate, true);
  assert.ok(
    r.exclusions
      .find((e) => e.quoteId === "moss")
      ?.reasons.includes("Arrives after your deadline"),
  );
});
test("every offered plan covers every item and meets its budget and arrival requirements", () => {
  const p = sampleProject();
  const r = buildPlans(p);
  assert.ok(r.plans.length > 1);
  for (const plan of r.plans) {
    assert.equal(plan.allocations.length, p.items.length);
    assert.equal(
      new Set(plan.allocations.map((l) => l.item.id)).size,
      p.items.length,
    );
    assert.ok(plan.totalCents <= p.budgetCents);
    assert.ok(plan.deliveryDate <= p.deadline);
    for (const l of plan.allocations) {
      assert.ok(l.units >= l.item.quantity);
      assert.ok(l.packs >= l.offer.minPacks);
    }
    for (const o of plan.orders)
      assert.ok(o.subtotalCents >= o.quote.minOrderCents!);
  }
});
test("insufficient budget produces no recommendation and reports the minimum feasible total", () => {
  const p = sampleProject();
  p.budgetCents = 70000;
  const r = buildPlans(p);
  assert.equal(r.plans.length, 0);
  assert.equal(r.minimumTotalCents, 75508);
  assert.match(r.issues.join(" "), /budget/);
});
test("a tighter delivery window chooses the faster complete supplier", () => {
  const p = sampleProject();
  p.deadline = datePlus(3);
  const r = buildPlans(p);
  assert.equal(r.plans[0].orders[0].quote.id, "west");
  assert.equal(r.plans[0].totalCents, 76239);
});
test("relaxing the deadline makes the lower-price supplier eligible without automatic change", () => {
  const p = sampleProject();
  p.deadline = datePlus(10);
  const r = buildPlans(p);
  assert.equal(r.plans[0].orders[0].quote.id, "moss");
  assert.equal(r.plans[0].totalCents, 62888);
});
test("unknown freight is not silently zero", () => {
  const p = sampleProject();
  p.quotes[1].shippingCents = null;
  const r = buildPlans(p);
  assert.ok(
    r.exclusions
      .find((e) => e.quoteId === "counter")
      ?.reasons.includes("Freight is not confirmed"),
  );
  assert.ok(
    r.plans.every((plan) => plan.orders.every((o) => o.quote.id !== "counter")),
  );
});
test("unreviewed, expired and foreign-currency quotes do not enter plans", () => {
  const p = sampleProject();
  p.quotes[0].confirmed = false;
  p.quotes[1].validUntil = "2020-01-01";
  p.quotes[2].currency = "EUR";
  const r = buildPlans(p);
  assert.equal(r.plans.length, 0);
  assert.equal(r.exclusions.length, 3);
});
test("pack rounding and MOQ produce enough units and a traceable surplus", () => {
  const p = sampleProject();
  p.items = p.items.slice(0, 1);
  p.items[0].quantity = 101;
  p.quotes = [p.quotes[1]];
  p.quotes[0].offers = p.quotes[0].offers.slice(0, 1);
  p.quotes[0].offers[0].minPacks = 3;
  const plan = buildPlans(p).plans[0];
  assert.equal(plan.allocations[0].packs, 3);
  assert.equal(plan.allocations[0].units, 300);
  assert.equal(plan.surplusUnits, 199);
  assert.equal(plan.orders[0].subtotalCents, 4200);
  assert.equal(plan.totalCents, 7525);
});
test("merchandise minimum does not count freight or tax", () => {
  const p = sampleProject();
  p.items = p.items.slice(0, 1);
  p.items[0].quantity = 100;
  p.quotes = [p.quotes[1]];
  p.quotes[0].offers = p.quotes[0].offers.slice(0, 1);
  p.quotes[0].minOrderCents = 1500;
  p.quotes[0].shippingCents = 2000;
  const r = buildPlans(p);
  assert.equal(r.plans.length, 0);
  assert.match(r.issues.join(" "), /minimum/);
});
test("missing coverage is explained instead of a partial order being recommended", () => {
  const p = sampleProject();
  p.quotes.forEach(
    (q) => (q.offers = q.offers.filter((o) => o.itemId !== "lids")),
  );
  const r = buildPlans(p);
  assert.equal(r.plans.length, 0);
  assert.match(r.issues.join(" "), /Lids/);
});
test("invalid dates and duplicate offer IDs are rejected on project import", () => {
  const p = sampleProject();
  p.deadline = "2026-02-30";
  assert.equal(projectSchema.safeParse(p).success, false);
  p.deadline = datePlus(7);
  p.quotes[0].offers.push(p.quotes[0].offers[0]);
  assert.equal(projectSchema.safeParse(p).success, false);
});
test("malformed budgets and zero quantities do not produce plans", () => {
  const p = sampleProject();
  p.budgetCents = NaN;
  assert.equal(buildPlans(p).plans.length, 0);
  p.budgetCents = 85000;
  p.items[0].quantity = 0;
  assert.equal(buildPlans(p).plans.length, 0);
});
test("past project deadline is explicitly rejected", () => {
  const p = sampleProject();
  p.deadline = "2020-01-01";
  const r = buildPlans(p);
  assert.equal(r.plans.length, 0);
  assert.match(r.issues.join(" "), /today/);
});
test("CSV and order documents contain the selected commercial totals and are marked as drafts", () => {
  const p = sampleProject();
  const plan = buildPlans(p).plans[0];
  const txt = orderText(p, plan);
  assert.match(txt, /DRAFT PURCHASE ORDER/);
  assert.match(txt, /Counter Supply/);
  assert.match(txt, /755\.08/);
  assert.match(txt, /not been sent or accepted/);
  assert.match(txt, /FICTIONAL/);
  assert.match(planCsv(p, plan), /755\.08/);
});
test("CSV export escapes spreadsheet formulas in supplier-provided strings", () => {
  const p = sampleProject();
  p.quotes[1].supplier = '=HYPERLINK("evil")';
  const plan = buildPlans(p).plans[0];
  assert.ok(planCsv(p, plan).includes("'="));
});
