import { z } from "zod";

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((v) => {
    const d = new Date(v + "T00:00:00Z");
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "Use a valid date");
const cents = z.number().int().min(0).max(100000000);
export const itemSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(160),
  quantity: z.number().int().min(1).max(1000000),
  unit: z.string().min(1).max(40),
});
export const offerSchema = z.object({
  itemId: z.string().min(1).max(80),
  description: z.string().max(250),
  packSize: z.number().int().min(1).max(1000000),
  priceCents: cents,
  minPacks: z.number().int().min(1).max(1000000),
  source: z.string().max(1000),
});
export const quoteSchema = z.object({
  id: z.string().min(1).max(80),
  supplier: z.string().min(1).max(160),
  reference: z.string().max(100),
  currency: z.string().regex(/^[A-Z]{3}$/),
  deliveryDate: date.nullable(),
  validUntil: date.nullable(),
  shippingCents: cents.nullable(),
  taxBps: z.number().int().min(0).max(10000).nullable(),
  minOrderCents: cents.nullable(),
  offers: z.array(offerSchema).min(1).max(6),
  notes: z.string().max(2000),
  sourceText: z.string().max(30000),
  confirmed: z.boolean(),
  origin: z.enum(["sample", "serv", "manual"]),
  requestId: z.string().max(200).optional(),
});
export const projectSchema = z
  .object({
    version: z.literal(1),
    id: z.string().min(1).max(80),
    title: z.string().min(1).max(160),
    currency: z.string().regex(/^[A-Z]{3}$/),
    budgetCents: cents,
    deadline: date,
    items: z.array(itemSchema).max(6),
    quotes: z.array(quoteSchema).max(6),
    buyer: z.object({
      name: z.string().max(160),
      address: z.string().max(1000),
      email: z.string().max(200),
    }),
    sample: z.boolean(),
    workspaceState: z
      .object({
        tab: z.enum(["quotes", "plans", "drafts"]),
        selectedId: z.string().max(1000).nullable(),
        planned: z.boolean(),
      })
      .optional(),
  })
  .superRefine((p, ctx) => {
    if (new Set(p.items.map((i) => i.id)).size !== p.items.length)
      ctx.addIssue({ code: "custom", message: "Item IDs must be unique" });
    if (new Set(p.quotes.map((q) => q.id)).size !== p.quotes.length)
      ctx.addIssue({ code: "custom", message: "Quote IDs must be unique" });
    for (const q of p.quotes) {
      if (new Set(q.offers.map((o) => o.itemId)).size !== q.offers.length)
        ctx.addIssue({
          code: "custom",
          message: "One offer per item per supplier is supported",
        });
      if (q.offers.some((o) => !p.items.some((i) => i.id === o.itemId)))
        ctx.addIssue({
          code: "custom",
          message: "Quote refers to an unknown item",
        });
    }
  });
export type Item = z.infer<typeof itemSchema>;
export type Quote = z.infer<typeof quoteSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Offer = z.infer<typeof offerSchema>;
export const isoToday = () => new Date().toISOString().slice(0, 10);
export const datePlus = (days: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};
export const money = (cents: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${currency} ${(cents / 100).toFixed(2)}`;
  }
};
export const shortDate = (value: string | null) =>
  value
    ? new Date(value + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : "Not stated";
export function emptyProject(): Project {
  return {
    version: 1,
    id: crypto.randomUUID(),
    title: "Untitled purchase",
    currency: "USD",
    budgetCents: 100000,
    deadline: datePlus(7),
    items: [],
    quotes: [],
    buyer: { name: "", address: "", email: "" },
    sample: false,
  };
}
