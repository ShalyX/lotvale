"use client";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Pencil,
  Check,
  ChevronDown,
  Download,
  AlertTriangle,
  Printer,
} from "lucide-react";
import { Brand } from "./brand";
import { Field, supplierColors } from "./ui";
import { money, shortDate, type Project } from "@/lib/schema";
import { buildPlans, type Plan } from "@/lib/planner";
import { download, orderText, planCsv } from "@/lib/exports";
export function PlanView({
  project: p,
  result: r,
  selected,
  onSelect,
  onBrief,
  onQuotes,
  onDrafts,
}: {
  project: Project;
  result: ReturnType<typeof buildPlans>;
  selected: Plan | null;
  onSelect: (id: string) => void;
  onBrief: () => void;
  onQuotes: () => void;
  onDrafts: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const fastest = r.plans.length
    ? [...r.plans].sort(
        (a, b) =>
          a.deliveryDate.localeCompare(b.deliveryDate) ||
          a.totalCents - b.totalCents,
      )[0]
    : null;
  const fewest = r.plans.length
    ? [...r.plans].sort(
        (a, b) =>
          a.supplierCount - b.supplierCount || a.totalCents - b.totalCents,
      )[0]
    : null;
  const options = [...r.plans.slice(0, expanded ? 24 : 4)];
  for (const extra of [fastest, fewest, selected])
    if (extra && !options.some((p) => p.id === extra.id)) options.push(extra);
  options.sort((a, b) => a.totalCents - b.totalCents);
  return (
    <section className="plan-work">
      {selected ? (
        <>
          <div className="plan-summary">
            <div className="plan-summary-heading">
              <span className="eyebrow">
                <CheckCircle2 size={15} />{" "}
                {selected.id === r.plans[0]?.id
                  ? "LOWEST COMPLETE TOTAL"
                  : "YOUR SELECTED PLAN"}
              </span>
              <span className="pill success">Within budget · on time</span>
            </div>
            <div className="plan-summary-values">
              <div className="plan-total">
                <span>{money(selected.totalCents, p.currency)}</span>
                <small>Complete purchase · including freight and tax</small>
              </div>
              <div className="plan-stat">
                <span>BUDGET REMAINING</span>
                <strong>
                  {money(p.budgetCents - selected.totalCents, p.currency)}
                </strong>
              </div>
              <div className="plan-stat">
                <span>ALL ITEMS ARRIVE BY</span>
                <strong>{shortDate(selected.deliveryDate)}</strong>
              </div>
              <div className="plan-stat">
                <span>SUPPLIERS</span>
                <strong>
                  {selected.supplierCount.toString().padStart(2, "0")}
                </strong>
              </div>
            </div>
            <div className="allocation-strip">
              {selected.orders.map((o, i) => (
                <div
                  key={o.quote.id}
                  style={{
                    flex: o.totalCents || 1,
                    background: supplierColors[i % supplierColors.length],
                  }}
                  title={`${o.quote.supplier}: ${money(o.totalCents, p.currency)}`}
                >
                  <span>{o.quote.supplier}</span>
                </div>
              ))}
            </div>
            <div className="plan-summary-bottom">
              <p>
                {selected.allocations.length} items covered
                {selected.surplusUnits
                  ? ` · ${selected.surplusUnits.toLocaleString()} extra units from pack rounding`
                  : ""}
              </p>
              <button className="button primary" onClick={onDrafts}>
                Prepare order drafts <ArrowRight size={16} />
              </button>
            </div>
          </div>
          {r.baselineCents !== null && (
            <div className="baseline-note">
              <span className="baseline-icon">
                <FileText size={19} />
              </span>
              <div>
                <strong>
                  The pack-price reference is{" "}
                  {money(r.baselineCents, p.currency)}.
                </strong>
                <p>
                  It excludes minimums, freight, tax and quote validity.
                  {r.baselineLate
                    ? " Its cheapest offers also arrive after your deadline."
                    : " Complete plans apply your confirmed commercial terms."}
                </p>
              </div>
            </div>
          )}
          <div className="section-heading">
            <div>
              <h2>A plan for your priorities.</h2>
              <p className="quiet">
                {r.plans.length.toLocaleString()} complete basket
                {r.plans.length === 1 ? "" : "s"} meet your requirements.
                Showing {options.length} options.
              </p>
            </div>
            <button className="text-link" onClick={onBrief}>
              Adjust requirements <Pencil size={14} />
            </button>
          </div>
          <div className="table-scroll">
            <table className="plans-table">
              <thead>
                <tr>
                  <th>BUYING PLAN</th>
                  <th>SUPPLIERS</th>
                  <th>ARRIVES BY</th>
                  <th>COMPLETE TOTAL</th>
                  <th>
                    <span className="sr-only">Select plan</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {options.map((plan, i) => (
                  <tr
                    key={plan.id}
                    className={selected.id === plan.id ? "selected" : ""}
                  >
                    <td>
                      <div className="plan-title">
                        <span className="plan-number">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <div>
                          <strong>
                            {plan.orders
                              .map((o) => o.quote.supplier)
                              .join(" + ")}
                          </strong>
                          <span>
                            {plan.id === r.plans[0]?.id
                              ? "Lowest complete total"
                              : plan.id === fastest?.id
                                ? "Earliest arrival"
                                : plan.supplierCount === 1
                                  ? "One supplier, one order"
                                  : "Split across suppliers"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{plan.supplierCount}</td>
                    <td>{shortDate(plan.deliveryDate)}</td>
                    <td className="table-money">
                      {money(plan.totalCents, p.currency)}
                    </td>
                    <td>
                      <button
                        className={`button small ${selected.id === plan.id ? "selected-button" : "secondary"}`}
                        aria-label={`Select plan ${i + 1}`}
                        aria-pressed={selected.id === plan.id}
                        onClick={() => onSelect(plan.id)}
                      >
                        {selected.id === plan.id ? (
                          <>
                            <Check size={14} /> Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {r.plans.length > 4 && (
            <button
              className="text-link show-more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded
                ? "Show priority options"
                : "Show up to 24 lowest-cost options"}{" "}
              <ChevronDown size={14} />
            </button>
          )}
          <div className="section-heading">
            <div>
              <h2>What goes on each order.</h2>
              <p className="quiet">
                Exact pack quantities from the selected plan.
              </p>
            </div>
          </div>
          {selected.orders.map((o, i) => (
            <div className="order-breakdown" key={o.quote.id}>
              <div className="order-breakdown-heading">
                <span
                  className="sheet-dot"
                  style={{
                    background: supplierColors[i % supplierColors.length],
                  }}
                />
                <h3>{o.quote.supplier}</h3>
                <span className="quiet">
                  {o.quote.reference} · delivery{" "}
                  {shortDate(o.quote.deliveryDate)}
                </span>
              </div>
              <div className="table-scroll">
                <table className="allocation-table">
                  <thead>
                    <tr>
                      <th>ITEM</th>
                      <th>NEEDED</th>
                      <th>PACKS × UNITS</th>
                      <th>ORDERED</th>
                      <th>LINE TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.lines.map((l) => (
                      <tr key={l.item.id}>
                        <td>{l.item.name}</td>
                        <td>{l.item.quantity.toLocaleString()}</td>
                        <td>
                          {l.packs.toLocaleString()} ×{" "}
                          {l.offer.packSize.toLocaleString()}
                        </td>
                        <td>{l.units.toLocaleString()}</td>
                        <td className="table-money">
                          {money(l.subtotalCents, p.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="order-costs">
                <span>
                  Merchandise <b>{money(o.subtotalCents, p.currency)}</b>
                </span>
                <span>
                  Freight <b>{money(o.shippingCents, p.currency)}</b>
                </span>
                <span>
                  Tax ({o.quote.taxBps! / 100}%){" "}
                  <b>{money(o.taxCents, p.currency)}</b>
                </span>
                <span className="order-cost-total">
                  Order total <b>{money(o.totalCents, p.currency)}</b>
                </span>
              </div>
            </div>
          ))}
          <div className="plan-export-bar">
            <p className="quiet">
              Tax applies to merchandise plus freight, as confirmed in the
              quote.
            </p>
            <button
              className="button small secondary"
              onClick={() =>
                download(
                  "lotvale-buying-plan.csv",
                  planCsv(p, selected),
                  "text/csv",
                )
              }
            >
              <Download size={15} /> Export comparison CSV
            </button>
          </div>
        </>
      ) : (
        <div className="infeasible-state">
          <AlertTriangle size={31} strokeWidth={1.4} />
          <span className="eyebrow">THIS PURCHASE NEEDS A CHANGE</span>
          <h2>No complete plan fits yet.</h2>
          <ul>
            {r.issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
          {r.minimumTotalCents !== null && (
            <p>
              The lowest otherwise eligible basket totals{" "}
              <strong>{money(r.minimumTotalCents, p.currency)}</strong>, which
              is {money(r.minimumTotalCents - p.budgetCents, p.currency)} above
              your budget.
            </p>
          )}
          <div className="hero-actions">
            <button className="button primary" onClick={onBrief}>
              Review requirements <Pencil size={15} />
            </button>
            <button className="button secondary" onClick={onQuotes}>
              Review supplier quotes
            </button>
          </div>
        </div>
      )}
      {r.exclusions.length > 0 && (
        <div className="excluded-section">
          <h3>Why some quotes stayed out.</h3>
          <p className="quiet">
            A supplier enters a plan when its confirmed terms meet your
            requirements.
          </p>
          {r.exclusions.map((e) => (
            <div className="excluded-row" key={e.quoteId}>
              <AlertTriangle size={16} />
              <strong>{e.supplier}</strong>
              <span>{e.reasons.join(" · ")}</span>
            </div>
          ))}
          <button className="text-link" onClick={onQuotes}>
            Review quotes <ArrowRight size={14} />
          </button>
        </div>
      )}
      <p className="workspace-footnote">
        {r.evaluated.toLocaleString()} item-to-supplier combinations evaluated.
        Confirm availability and delivery with suppliers before ordering.
      </p>
    </section>
  );
}
export function DraftView({
  project: p,
  plan,
  onBuyer,
}: {
  project: Project;
  plan: Plan;
  onBuyer: (b: Project["buyer"]) => void;
}) {
  return (
    <section className="draft-work">
      <div className="section-heading">
        <div>
          <h2>Ready for a final review.</h2>
          <p className="quiet">
            {plan.orders.length} supplier draft
            {plan.orders.length === 1 ? "" : "s"} ·{" "}
            {money(plan.totalCents, p.currency)} complete total
          </p>
        </div>
        <div className="button-group">
          <button
            className="button small secondary"
            onClick={() => window.print()}
          >
            <Printer size={15} /> Print
          </button>
          <button
            className="button primary small"
            onClick={() =>
              download("lotvale-draft-orders.txt", orderText(p, plan))
            }
          >
            <Download size={15} /> Download order drafts
          </button>
        </div>
      </div>
      <div className="buyer-form">
        <h3>Who is buying?</h3>
        <div className="field-grid">
          <Field label="Buyer / business name">
            <input
              value={p.buyer.name}
              maxLength={160}
              onChange={(e) => onBuyer({ ...p.buyer, name: e.target.value })}
            />
          </Field>
          <Field label="Contact email">
            <input
              type="email"
              value={p.buyer.email}
              maxLength={200}
              onChange={(e) => onBuyer({ ...p.buyer, email: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Delivery address">
          <textarea
            rows={2}
            maxLength={1000}
            value={p.buyer.address}
            onChange={(e) => onBuyer({ ...p.buyer, address: e.target.value })}
          />
        </Field>
      </div>
      <div className="draft-notice">
        <FileText size={18} />
        <p>
          Drafts have not been sent or accepted. Confirm current availability,
          tax and delivery with suppliers before ordering.
          {(!p.buyer.name || !p.buyer.address || !p.buyer.email) &&
            " Missing buyer details are marked in the download."}
        </p>
      </div>
      {plan.orders.map((o, i) => (
        <article className="draft-document" key={o.quote.id}>
          <div className="draft-doc-header">
            <Brand small />
            <span className="draft-stamp">DRAFT PURCHASE ORDER</span>
          </div>
          <div className="draft-doc-title">
            <h3>{o.quote.supplier}</h3>
            <span>
              {i + 1} / {plan.orders.length}
            </span>
          </div>
          <div className="draft-doc-info">
            <div>
              <span>BUYER</span>
              <strong>{p.buyer.name || "Buyer name required"}</strong>
              <p>{p.buyer.address || "Delivery address required"}</p>
              <p>{p.buyer.email || "Contact required"}</p>
            </div>
            <div>
              <span>BASED ON QUOTE</span>
              <strong>{o.quote.reference || "No reference"}</strong>
              <p>Delivery: {shortDate(o.quote.deliveryDate)}</p>
              <p>Valid until: {shortDate(o.quote.validUntil)}</p>
            </div>
          </div>
          <div className="table-scroll">
            <table className="allocation-table">
              <thead>
                <tr>
                  <th>ITEM / QUANTITY</th>
                  <th>PRICE / PACK</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {o.lines.map((l) => (
                  <tr key={l.item.id}>
                    <td>
                      <strong>{l.item.name}</strong>
                      <small>
                        {l.packs} packs × {l.offer.packSize} ={" "}
                        {l.units.toLocaleString()} {l.item.unit}
                      </small>
                    </td>
                    <td>{money(l.offer.priceCents, p.currency)}</td>
                    <td className="table-money">
                      {money(l.subtotalCents, p.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="draft-totals">
            <div>
              <span>Merchandise</span>
              <strong>{money(o.subtotalCents, p.currency)}</strong>
            </div>
            <div>
              <span>Freight</span>
              <strong>{money(o.shippingCents, p.currency)}</strong>
            </div>
            <div>
              <span>
                Tax · {o.quote.taxBps! / 100}% on merchandise + freight
              </span>
              <strong>{money(o.taxCents, p.currency)}</strong>
            </div>
            <div className="grand-total">
              <span>ORDER TOTAL</span>
              <strong>{money(o.totalCents, p.currency)}</strong>
            </div>
          </div>
          {o.quote.notes && <p className="draft-doc-notes">{o.quote.notes}</p>}
          <p className="draft-doc-footer">
            {p.sample ? "FICTIONAL DEMONSTRATION DATA · " : ""}Draft prepared in
            Lotvale. Review before ordering. No order has been placed.
          </p>
        </article>
      ))}
    </section>
  );
}
