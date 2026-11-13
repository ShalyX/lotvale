import { money, type Project } from "./schema.ts";
import type { Plan } from "./planner.ts";
const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replaceAll('"', '""') + '"';
};
export function planCsv(p: Project, plan: Plan): string {
  const rows: unknown[][] = [
    [
      "Supplier",
      "Quote reference",
      "Item",
      "Required units",
      "Packs",
      "Units per pack",
      "Ordered units",
      "Price per pack",
      "Line subtotal",
      "Currency",
    ],
  ];
  for (const l of plan.allocations)
    rows.push([
      l.quote.supplier,
      l.quote.reference,
      l.item.name,
      l.item.quantity,
      l.packs,
      l.offer.packSize,
      l.units,
      (l.offer.priceCents / 100).toFixed(2),
      (l.subtotalCents / 100).toFixed(2),
      p.currency,
    ]);
  rows.push([]);
  rows.push([
    "Supplier",
    "Merchandise",
    "Freight",
    "Tax",
    "Order total",
    "Currency",
  ]);
  for (const o of plan.orders)
    rows.push([
      o.quote.supplier,
      (o.subtotalCents / 100).toFixed(2),
      (o.shippingCents / 100).toFixed(2),
      (o.taxCents / 100).toFixed(2),
      (o.totalCents / 100).toFixed(2),
      p.currency,
    ]);
  rows.push([
    "TOTAL",
    "",
    "",
    "",
    (plan.totalCents / 100).toFixed(2),
    p.currency,
  ]);
  return "\uFEFF" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
}
export function orderText(p: Project, plan: Plan): string {
  return plan.orders
    .map((o, i) =>
      [
        `DRAFT PURCHASE ORDER — LOTVALE`,
        `${p.title}`,
        `Order ${i + 1} of ${plan.orders.length} | Generated ${new Date().toISOString().slice(0, 10)}`,
        `Supplier: ${o.quote.supplier}`,
        `Source quote: ${o.quote.reference || "No reference provided"}`,
        `Buyer: ${p.buyer.name || "[Buyer name required]"}`,
        `Delivery address: ${p.buyer.address || "[Delivery address required]"}`,
        `Contact: ${p.buyer.email || "[Buyer contact required]"}`,
        `Required by: ${p.deadline} | Quoted delivery: ${o.quote.deliveryDate}`,
        "",
        ...o.lines.map(
          (l) =>
            `${l.item.name}\n  ${l.packs} packs × ${l.offer.packSize} ${l.item.unit} = ${l.units} ${l.item.unit}\n  ${money(l.offer.priceCents, p.currency)} / pack; line ${money(l.subtotalCents, p.currency)}`,
        ),
        "",
        `Merchandise: ${money(o.subtotalCents, p.currency)}`,
        `Freight: ${money(o.shippingCents, p.currency)}`,
        `Tax (${o.quote.taxBps! / 100}% on merchandise + freight): ${money(o.taxCents, p.currency)}`,
        `ORDER TOTAL: ${money(o.totalCents, p.currency)}`,
        "",
        `Quote valid until: ${o.quote.validUntil}`,
        `Terms / notes: ${o.quote.notes || "No additional notes."}`,
        "Draft only. Review current availability, delivery, tax and terms with the supplier before placing this order. This document has not been sent or accepted.",
        p.sample
          ? "FICTIONAL DEMONSTRATION DATA — not a commercial order."
          : "",
      ].join("\n"),
    )
    .join("\n\n" + "─".repeat(55) + "\n\n");
}
export function download(name: string, text: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
