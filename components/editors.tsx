"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Plus,
  X,
  Download,
  Upload,
  FileText,
  Check,
  Trash2,
  LoaderCircle,
  ChevronDown,
} from "lucide-react";
import { Field, Modal } from "./ui";
import {
  isoToday,
  projectSchema,
  quoteSchema,
  type Project,
  type Quote,
  type Item,
} from "@/lib/schema";
export function blankQuote(p: Project, sourceText = ""): Quote {
  return {
    id: crypto.randomUUID(),
    supplier: "",
    reference: "",
    currency: p.currency,
    deliveryDate: null,
    validUntil: null,
    shippingCents: null,
    taxBps: null,
    minOrderCents: null,
    offers: p.items.map((i) => ({
      itemId: i.id,
      description: i.name,
      packSize: NaN,
      priceCents: NaN,
      minPacks: 1,
      source: "",
    })),
    notes: "",
    sourceText,
    confirmed: false,
    origin: "manual",
  };
}

export function BriefEditor({
  project,
  onClose,
  onSave,
}: {
  project: Project;
  onClose: () => void;
  onSave: (p: Project) => void;
}) {
  const [p, setP] = useState(() => structuredClone(project));
  const [error, setError] = useState("");
  const changeItem = (id: string, patch: Partial<Item>) =>
    setP({
      ...p,
      items: p.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = projectSchema.safeParse(p);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Check the purchase fields.");
      return;
    }
    if (p.deadline < isoToday()) {
      setError("Choose a deadline from today onward.");
      return;
    }
    const changed = new Set(
      p.items
        .filter((i) => {
          const before = project.items.find((x) => x.id === i.id);
          return !before || before.name !== i.name || before.unit !== i.unit;
        })
        .map((i) => i.id),
    );
    onSave({
      ...parsed.data,
      quotes: parsed.data.quotes.map((q) =>
        q.offers.some((o) => changed.has(o.itemId))
          ? { ...q, confirmed: false }
          : q,
      ),
    });
  };
  return (
    <Modal title="Your purchase brief" onClose={onClose} wide>
      <form onSubmit={submit}>
        <div className="modal-body">
          <Field label="Purchase name">
            <input
              value={p.title}
              maxLength={160}
              required
              onChange={(e) => setP({ ...p, title: e.target.value })}
            />
          </Field>
          <div className="field-grid three">
            <Field label="Budget">
              <input
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={p.budgetCents / 100}
                required
                onChange={(e) =>
                  setP({
                    ...p,
                    budgetCents: Math.round(Number(e.target.value) * 100),
                  })
                }
              />
            </Field>
            <Field label="Currency" hint="One currency per purchase">
              <select
                value={p.currency}
                onChange={(e) => setP({ ...p, currency: e.target.value })}
              >
                {Array.from(
                  new Set([
                    p.currency,
                    "USD",
                    "GBP",
                    "EUR",
                    "NGN",
                    "CAD",
                    "AUD",
                  ]),
                ).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Needed by">
              <input
                type="date"
                required
                min={isoToday()}
                value={p.deadline}
                onChange={(e) => setP({ ...p, deadline: e.target.value })}
              />
            </Field>
          </div>
          <div className="section-heading compact">
            <h3>What do you need?</h3>
            <span className="quiet">{p.items.length}/6 items</span>
          </div>
          {p.items.map((i, index) => (
            <div className="basket-editor-row" key={i.id}>
              <Field label={`Item ${index + 1}`}>
                <input
                  required
                  value={i.name}
                  maxLength={160}
                  onChange={(e) => changeItem(i.id, { name: e.target.value })}
                />
              </Field>
              <Field label="Quantity">
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  step="1"
                  required
                  value={i.quantity}
                  onChange={(e) =>
                    changeItem(i.id, { quantity: Number(e.target.value) })
                  }
                />
              </Field>
              <Field label="Unit">
                <input
                  required
                  maxLength={40}
                  value={i.unit}
                  onChange={(e) => changeItem(i.id, { unit: e.target.value })}
                />
              </Field>
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove ${i.name}`}
                onClick={() =>
                  setP({
                    ...p,
                    items: p.items.filter((x) => x.id !== i.id),
                    quotes: p.quotes
                      .map((q) => ({
                        ...q,
                        confirmed: false,
                        offers: q.offers.filter((o) => o.itemId !== i.id),
                      }))
                      .filter((q) => q.offers.length > 0),
                  })
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="button small secondary"
            disabled={p.items.length >= 6}
            onClick={() =>
              setP({
                ...p,
                items: [
                  ...p.items,
                  {
                    id: crypto.randomUUID(),
                    name: "",
                    quantity: 1,
                    unit: "units",
                  },
                ],
              })
            }
          >
            <Plus size={15} /> Add item
          </button>
          <p className="quiet form-note">
            Specify the size or specification. Pack quantities come from the
            quotes. Changing an item specification requires reviewing its quotes
            again.
          </p>
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" type="submit">
            Save purchase brief <Check size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function QuoteImporter({
  project,
  onClose,
  onReview,
}: {
  project: Project;
  onClose: () => void;
  onReview: (q: Quote) => void;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const interpret = async () => {
    setError("");
    setWarnings([]);
    setBusy(true);
    controller.current = new AbortController();
    try {
      const r = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: text,
          items: project.items,
          currency: project.currency,
        }),
        signal: controller.current.signal,
      });
      const data = (await r.json()) as {
        quote?: unknown;
        warnings?: string[];
        error?: string;
      };
      if (!r.ok) {
        setWarnings(data.warnings || []);
        throw new Error(data.error || "Could not interpret quote.");
      }
      const q = quoteSchema.parse(data.quote);
      q.notes = [
        q.notes,
        ...(data.warnings || []).map((w: string) => "REVIEW: " + w),
      ]
        .filter(Boolean)
        .join("\n")
        .slice(0, 2000);
      onReview(q);
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const loadFile = async (f: File) => {
    if (f.size > 100000 || !/\.(txt|csv)$/i.test(f.name)) {
      setError(
        "Use a text or CSV file up to 100 KB. For a PDF, copy its text and paste it here.",
      );
      return;
    }
    try {
      const value = await f.text();
      if (value.length > 24000) {
        setError("Use no more than 24,000 characters of quote text.");
        return;
      }
      setText(value);
      setError("");
    } catch {
      setError("This file could not be read. Try pasting its text.");
    }
  };
  return (
    <Modal title="Bring in a supplier quote" onClose={onClose} wide>
      <div className="modal-body">
        <div className="import-info">
          <FileText size={23} />
          <div>
            <strong>One supplier at a time.</strong>
            <p>
              Paste quote text or import .txt / .csv. For a PDF, copy the text
              from your document.
            </p>
          </div>
          <button
            type="button"
            className="button small secondary"
            disabled={busy}
            onClick={() => fileInput.current?.click()}
          >
            <Upload size={15} /> Import file
          </button>
          <input
            ref={fileInput}
            type="file"
            hidden
            accept=".txt,.csv,text/plain,text/csv"
            onChange={(e) => {
              if (e.target.files?.[0]) void loadFile(e.target.files[0]);
            }}
          />
        </div>
        <Field label="Supplier quote text">
          <textarea
            value={text}
            maxLength={24000}
            rows={13}
            placeholder="Paste supplier name, quote reference, descriptions, pack sizes, prices, tax, freight and delivery terms…"
            disabled={busy}
            onChange={(e) => setText(e.target.value)}
          />
        </Field>
        <div className="input-meta">
          <span>{text.length.toLocaleString()} / 24,000 characters</span>
          <span>Interpreted with SERV Reasoning</span>
        </div>
        <p className="quiet form-note">
          Only the quote text and basket items are sent to SERV. Review the
          extracted terms before using them. Remove sensitive details you do not
          need to share.
        </p>
        {error && (
          <div className="alert error" role="alert">
            {error}
            {warnings.length > 0 && (
              <ul>
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="modal-actions">
        <button
          className="button secondary"
          disabled={busy}
          onClick={() => onReview(blankQuote(project, text))}
        >
          Enter terms manually
        </button>
        <button
          className="button primary"
          disabled={busy || text.trim().length < 30}
          onClick={() => void interpret()}
        >
          {busy ? (
            <>
              <LoaderCircle size={17} className="spin" /> Reading supplier
              terms…
            </>
          ) : (
            <>
              Interpret quote <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}

export function QuoteEditor({
  project,
  quote,
  onClose,
  onSave,
  onDelete,
}: {
  project: Project;
  quote: Quote;
  onClose: () => void;
  onSave: (q: Quote) => void;
  onDelete: () => void;
}) {
  const [q, setQ] = useState(() => structuredClone(quote));
  const [error, setError] = useState("");
  const setMoney = (key: "shippingCents" | "minOrderCents", v: string) =>
    setQ({ ...q, [key]: v === "" ? null : Math.round(Number(v) * 100) });
  const changeOffer = (id: string, patch: Partial<Quote["offers"][number]>) =>
    setQ({
      ...q,
      offers: q.offers.map((o) => (o.itemId === id ? { ...o, ...patch } : o)),
    });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const checked = quoteSchema.safeParse(q);
    if (!checked.success) {
      setError(
        "Check prices, pack quantities, dates and supplier name. At least one item is required.",
      );
      return;
    }
    if (
      q.confirmed &&
      [
        q.shippingCents,
        q.minOrderCents,
        q.taxBps,
        q.deliveryDate,
        q.validUntil,
      ].some((v) => v === null || v === "")
    ) {
      setError(
        "Confirm freight, tax, order minimum, delivery and validity before marking terms reviewed. Enter zero only when the charge or minimum is confirmed as zero.",
      );
      return;
    }
    onSave(checked.data);
  };
  return (
    <Modal title="Review supplier terms" onClose={onClose} wide>
      <form onSubmit={submit}>
        <div className="modal-body">
          <div className="review-origin">
            <span className="pill neutral">
              {q.origin === "serv"
                ? "Extracted with SERV"
                : q.origin === "sample"
                  ? "Fictional sample"
                  : "Manual entry"}
            </span>
            {q.requestId && (
              <span className="quiet request-id" title={q.requestId}>
                Request {q.requestId.slice(-10)}
              </span>
            )}
            <span className="quiet">Prices are per pack.</span>
          </div>
          <div className="field-grid">
            <Field label="Supplier name">
              <input
                value={q.supplier}
                required
                maxLength={160}
                onChange={(e) => setQ({ ...q, supplier: e.target.value })}
              />
            </Field>
            <Field label="Quote reference">
              <input
                value={q.reference}
                maxLength={100}
                onChange={(e) => setQ({ ...q, reference: e.target.value })}
              />
            </Field>
          </div>
          <div className="field-grid three">
            <Field label="Quote currency">
              <input
                value={q.currency}
                required
                maxLength={3}
                pattern="[A-Z]{3}"
                onChange={(e) =>
                  setQ({ ...q, currency: e.target.value.toUpperCase() })
                }
              />
            </Field>
            <Field label="Delivery date">
              <input
                type="date"
                value={q.deliveryDate || ""}
                onChange={(e) =>
                  setQ({ ...q, deliveryDate: e.target.value || null })
                }
              />
            </Field>
            <Field label="Quote valid until">
              <input
                type="date"
                value={q.validUntil || ""}
                onChange={(e) =>
                  setQ({ ...q, validUntil: e.target.value || null })
                }
              />
            </Field>
          </div>
          <div className="field-grid three">
            <Field label={`Freight (${q.currency})`} hint="Blank means unknown">
              <input
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={q.shippingCents === null ? "" : q.shippingCents / 100}
                onChange={(e) => setMoney("shippingCents", e.target.value)}
              />
            </Field>
            <Field label="Tax (%)" hint="On merchandise + freight">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={q.taxBps === null ? "" : q.taxBps / 100}
                onChange={(e) =>
                  setQ({
                    ...q,
                    taxBps:
                      e.target.value === ""
                        ? null
                        : Math.round(Number(e.target.value) * 100),
                  })
                }
              />
            </Field>
            <Field
              label={`Order minimum (${q.currency})`}
              hint="Merchandise only"
            >
              <input
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={q.minOrderCents === null ? "" : q.minOrderCents / 100}
                onChange={(e) => setMoney("minOrderCents", e.target.value)}
              />
            </Field>
          </div>
          <h3 className="form-section-title">Items in this quote</h3>
          {q.offers.map((o) => {
            const item = project.items.find((i) => i.id === o.itemId);
            return (
              <div className="offer-editor" key={o.itemId}>
                <div className="offer-title">
                  <strong>{item?.name || "Unknown item"}</strong>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`Remove offer for ${item?.name}`}
                    onClick={() =>
                      setQ({
                        ...q,
                        offers: q.offers.filter((x) => x.itemId !== o.itemId),
                      })
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="field-grid three">
                  <Field label="Units per pack">
                    <input
                      type="number"
                      required
                      min="1"
                      max="1000000"
                      step="1"
                      value={Number.isFinite(o.packSize) ? o.packSize : ""}
                      onChange={(e) =>
                        changeOffer(o.itemId, {
                          packSize: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                  <Field label={`Price / pack (${q.currency})`}>
                    <input
                      type="number"
                      required
                      min="0"
                      max="1000000"
                      step="0.01"
                      value={
                        Number.isFinite(o.priceCents) ? o.priceCents / 100 : ""
                      }
                      onChange={(e) =>
                        changeOffer(o.itemId, {
                          priceCents: Math.round(Number(e.target.value) * 100),
                        })
                      }
                    />
                  </Field>
                  <Field label="Minimum packs">
                    <input
                      type="number"
                      required
                      min="1"
                      max="1000000"
                      step="1"
                      value={o.minPacks}
                      onChange={(e) =>
                        changeOffer(o.itemId, {
                          minPacks: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                </div>
                {o.source && (
                  <blockquote className="source-excerpt">
                    “{o.source}”
                  </blockquote>
                )}
              </div>
            );
          })}
          {project.items
            .filter((i) => !q.offers.some((o) => o.itemId === i.id))
            .map((i) => (
              <button
                key={i.id}
                type="button"
                className="button small ghost add-offer"
                onClick={() =>
                  setQ({
                    ...q,
                    offers: [
                      ...q.offers,
                      {
                        itemId: i.id,
                        description: i.name,
                        packSize: NaN,
                        priceCents: NaN,
                        minPacks: 1,
                        source: "",
                      },
                    ],
                  })
                }
              >
                <Plus size={14} /> Add offer: {i.name}
              </button>
            ))}
          <Field label="Commercial notes / points to review">
            <textarea
              rows={3}
              maxLength={2000}
              value={q.notes}
              onChange={(e) => setQ({ ...q, notes: e.target.value })}
            />
          </Field>
          <details className="source-details">
            <summary>
              <FileText size={15} /> Original quote text{" "}
              <ChevronDown size={15} />
            </summary>
            <pre>
              {q.sourceText || "No source provided. Terms entered manually."}
            </pre>
          </details>
          <label className="confirm-checkbox">
            <input
              type="checkbox"
              checked={q.confirmed}
              onChange={(e) => setQ({ ...q, confirmed: e.target.checked })}
            />
            <span>
              I have checked the item matches, pack prices, tax basis, freight,
              minimums and dates against the supplier terms.
            </span>
          </label>
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button
            className="button ghost danger"
            type="button"
            onClick={() => {
              if (
                window.confirm(`Remove ${q.supplier || "this supplier quote"}?`)
              )
                onDelete();
            }}
          >
            <Trash2 size={15} /> Remove
          </button>
          <button className="button primary" type="submit">
            Save {q.confirmed ? "reviewed quote" : "draft quote"}{" "}
            <Check size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
