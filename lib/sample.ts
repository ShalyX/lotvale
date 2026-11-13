import { datePlus, type Project, type Quote } from "./schema.ts";
export function sampleProject(): Project {
  const specs = [
    ["moss", "Moss Paperworks", "MP-1048", 9, 4500, 0, [1100, 650, 400, 900]],
    [
      "counter",
      "Counter Supply",
      "CS-2206",
      5,
      2800,
      0,
      [1400, 750, 520, 1200],
    ],
    [
      "west",
      "Westbridge Goods",
      "WG-0311",
      3,
      1800,
      30000,
      [1390, 800, 480, 1350],
    ],
  ] as const;
  const items = [
    {
      id: "cups",
      name: "12 oz kraft coffee cups",
      quantity: 2400,
      unit: "cups",
    },
    { id: "lids", name: "Lids for 12 oz cups", quantity: 2400, unit: "lids" },
    {
      id: "sleeves",
      name: "Kraft cup sleeves",
      quantity: 1200,
      unit: "sleeves",
    },
    {
      id: "napkins",
      name: "Recycled paper napkins",
      quantity: 4000,
      unit: "napkins",
    },
  ];
  const quotes: Quote[] = specs.map(
    ([id, supplier, reference, days, shippingCents, minOrderCents, prices]) => {
      const offers = items.map((item, i) => ({
        itemId: item.id,
        description: item.name,
        packSize: i === 3 ? 500 : 100,
        priceCents: prices[i],
        minPacks: 1,
        source: `${item.name}: pack of ${i === 3 ? 500 : 100}, USD ${(prices[i] / 100).toFixed(2)} per pack.`,
      }));
      const sourceText = `FICTIONAL DEMONSTRATION QUOTE\n${supplier} | ${reference}\nCurrency: USD\n${offers.map((o) => o.source).join("\n")}\nMinimum quantity: 1 pack per item.\nMerchandise minimum: USD ${(minOrderCents / 100).toFixed(2)}.\nFreight: USD ${(shippingCents / 100).toFixed(2)}.\nTax: 7.5% on merchandise and freight.\nDelivery: ${datePlus(days)}.\nValid until: ${datePlus(14)}.\nNo substitutions offered. All quantities are quoted packs.`;
      return {
        id,
        supplier,
        reference,
        currency: "USD",
        deliveryDate: datePlus(days),
        validUntil: datePlus(14),
        shippingCents,
        taxBps: 750,
        minOrderCents,
        offers,
        notes:
          id === "moss"
            ? "Lowest pack prices; delivery falls after the opening deadline."
            : "Pack prices and delivery as quoted. Confirm current availability with the supplier.",
        sourceText,
        confirmed: true,
        origin: "sample",
      };
    },
  );
  return {
    version: 1,
    id: "sample-cafe",
    title: "A new counter. One complete order.",
    currency: "USD",
    budgetCents: 85000,
    deadline: datePlus(7),
    items,
    quotes,
    buyer: { name: "Northside Coffee — sample buyer", address: "", email: "" },
    sample: true,
  };
}
