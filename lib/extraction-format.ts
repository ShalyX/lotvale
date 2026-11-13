// Provider-enforced structure, followed by independent Zod validation at the API boundary.
const nullableInteger = { type: ["integer", "null"] };
const nullableDate = { type: ["string", "null"] };
export const extractionFormat = {
  type: "json_schema",
  json_schema: {
    name: "supplier_quote",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supplier: { type: "string" },
        reference: { type: "string" },
        currency: { type: "string" },
        deliveryDate: nullableDate,
        validUntil: nullableDate,
        shippingCents: nullableInteger,
        taxBps: nullableInteger,
        minOrderCents: nullableInteger,
        offers: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              itemId: { type: "string" },
              description: { type: "string" },
              packSize: { type: "integer" },
              priceCents: { type: "integer" },
              minPacks: { type: "integer" },
              source: { type: "string" },
            },
            required: [
              "itemId",
              "description",
              "packSize",
              "priceCents",
              "minPacks",
              "source",
            ],
          },
        },
        notes: { type: "string" },
        warnings: { type: "array", items: { type: "string" } },
      },
      required: [
        "supplier",
        "reference",
        "currency",
        "deliveryDate",
        "validUntil",
        "shippingCents",
        "taxBps",
        "minOrderCents",
        "offers",
        "notes",
        "warnings",
      ],
    },
  },
};
