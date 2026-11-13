"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  X,
  Download,
  Upload,
  FileText,
  Check,
  AlertTriangle,
  Layers3,
  Package,
  Pencil,
  LoaderCircle,
  CircleHelp,
} from "lucide-react";
import { Brand } from "./brand";
import { Modal, supplierColors } from "./ui";
import { BriefEditor, QuoteImporter, QuoteEditor } from "./editors";
import { PlanView, DraftView } from "./plans";
import {
  emptyProject,
  money,
  projectSchema,
  shortDate,
  type Project,
  type Quote,
} from "@/lib/schema";
import { buildPlans, quoteIssues } from "@/lib/planner";
import { sampleProject } from "@/lib/sample";
import { download } from "@/lib/exports";
const STORAGE = "lotvale.purchase.v1";
type Tab = "quotes" | "plans" | "drafts";
export function Workspace() {
  const [project, setProject] = useState<Project | null>(null);
  const [tab, setTab] = useState<Tab>("quotes");
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");
  const [brief, setBrief] = useState(false);
  const [importing, setImporting] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [planned, setPlanned] = useState(false);
  const [replace, setReplace] = useState<"new" | "sample" | null>(null);
  const [dirty, setDirty] = useState(false);
  const backupInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const saved = localStorage.getItem(STORAGE);
      const parsed = saved ? projectSchema.safeParse(JSON.parse(saved)) : null;
      const requested = params.has("new")
        ? "new"
        : params.has("sample")
          ? "sample"
          : null;
      setProject(
        parsed?.success
          ? parsed.data
          : requested === "new"
            ? emptyProject()
            : sampleProject(),
      );
      if (parsed?.success && requested) setReplace(requested);
      if (saved && !parsed?.success)
        setSaveError(
          "The saved purchase could not be read. Import a backup to recover it; this session will not overwrite it until you make a change.",
        );
    } catch {
      setProject(sampleProject());
      setSaveError(
        "Browser storage is unavailable. Export a backup before leaving.",
      );
    }
    window.history.replaceState({}, "", window.location.pathname);
  }, []);
  useEffect(() => {
    if (!project || !dirty) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(project));
      setSaveError("");
    } catch {
      setSaveError(
        "Could not save in this browser. Export a backup before leaving.",
      );
    }
  }, [project, dirty]);
  const result = useMemo(
    () => (project ? buildPlans(project) : null),
    [project?.items, project?.quotes, project?.currency, project?.deadline, project?.budgetCents],
  );
  const selected =
    result?.plans.find((p) => p.id === selectedId) || result?.plans[0] || null;
  const update = (next: Project) => {
    setProject(next);
    setDirty(true);
    setSelectedId(null);
    setPlanned(false);
    if (tab === "drafts") setTab("plans");
  };
  const saveQuote = (q: Quote) => {
    if (!project) return;
    update({
      ...project,
      quotes: project.quotes.some((x) => x.id === q.id)
        ? project.quotes.map((x) => (x.id === q.id ? q : x))
        : [...project.quotes, q],
    });
    setEditing(null);
    setNotice(
      `${q.supplier} saved. Rebuild buying plans when your quotes are ready.`,
    );
  };
  const build = () => {
    setPlanned(true);
    setSelectedId(null);
    setTab("plans");
    setNotice("Buying plans recalculated from the current confirmed terms.");
  };
  const restore = async (file: File) => {
    try {
      if (file.size > 400000) throw new Error("Too large");
      const data = projectSchema.parse(JSON.parse(await file.text()));
      setProject(data);
      setDirty(true);
      setSelectedId(null);
      setPlanned(false);
      setTab("quotes");
      setNotice("Project backup restored.");
    } catch {
      setNotice(
        "This is not a valid Lotvale backup. The current purchase was preserved.",
      );
    }
  };
  if (!project || !result)
    return (
      <div className="app-loading">
        <Brand />
        <LoaderCircle className="spin" />
        <p>Opening your buying desk…</p>
      </div>
    );
  const confirmed = project.quotes.filter((q) => q.confirmed).length;
  return (
    <div className="workspace">
      <header className="workspace-header">
        <Link href="/" aria-label="Lotvale home">
          <Brand small />
        </Link>
        <span className="workspace-label">YOUR BUYING DESK</span>
        <div className="workspace-tools">
          <span className={`save-status ${saveError ? "danger" : ""}`}>
            <span />
            {saveError ? "Backup recommended" : "Saved in this browser"}
          </span>
          <button
            className="button small ghost"
            aria-label="Download project backup"
            onClick={() =>
              download(
                "lotvale-project.json",
                JSON.stringify(project, null, 2),
                "application/json",
              )
            }
          >
            <Download size={15} />
            <span>Backup</span>
          </button>
          <button
            className="icon-button"
            title="Restore project backup"
            aria-label="Restore project backup"
            onClick={() => backupInput.current?.click()}
          >
            <Upload size={17} />
          </button>
          <input
            ref={backupInput}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (
                f &&
                window.confirm(
                  "Replace this purchase with the backup? Export your current purchase first if needed.",
                )
              )
                void restore(f);
              e.target.value = "";
            }}
          />
        </div>
      </header>
      <div className="workspace-layout">
        <aside className="brief-rail">
          <div className="rail-eyebrow">PURCHASE / 01</div>
          <h2>{project.title}</h2>
          <button
            className="text-link rail-edit"
            onClick={() => setBrief(true)}
          >
            <Pencil size={13} /> Edit purchase brief
          </button>
          <div className="rail-terms">
            <div>
              <span>Budget</span>
              <strong>{money(project.budgetCents, project.currency)}</strong>
            </div>
            <div>
              <span>Needed by</span>
              <strong>{shortDate(project.deadline)}</strong>
            </div>
            <div>
              <span>Currency</span>
              <strong>{project.currency}</strong>
            </div>
          </div>
          <div className="rail-section-label">
            <span>THE BASKET</span>
            <span>{project.items.length} items</span>
          </div>
          {project.items.length ? (
            <ul className="basket-list">
              {project.items.map((item, i) => (
                <li key={item.id}>
                  <span className="item-index">0{i + 1}</span>
                  <div>
                    <span>{item.name}</span>
                    <small>
                      {item.quantity.toLocaleString()} {item.unit}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="quiet">Start with the items you need to buy.</p>
          )}
          <button
            className="button secondary small rail-add"
            onClick={() => setBrief(true)}
          >
            <Plus size={14} />{" "}
            {project.items.length ? "Edit basket" : "Add basket items"}
          </button>
          <div className="rail-bottom">
            <p>
              <Package size={17} /> Plan here. Place orders with your suppliers.
            </p>
            <button className="text-link" onClick={() => setReplace("new")}>
              New purchase <Plus size={14} />
            </button>
            <button className="text-link" onClick={() => setReplace("sample")}>
              Explore sample <ArrowUpRight size={14} />
            </button>
          </div>
        </aside>
        <main className="work-area">
          <div className="work-top">
            <div>
              <span className="eyebrow">FROM QUOTES TO A COMPLETE ORDER</span>
              <h1>
                {tab === "quotes"
                  ? "Start with the details."
                  : tab === "plans"
                    ? "See the whole purchase."
                    : "Your order, on paper."}
              </h1>
              <p className="quiet">
                {tab === "quotes"
                  ? "Bring your supplier terms together. Keep every detail in view."
                  : tab === "plans"
                    ? "Complete baskets, with the costs and commitments that matter."
                    : "Supplier-specific drafts from your selected buying plan."}
              </p>
            </div>
            <span className="project-state">
              <span className="state-dot" />
              {tab === "quotes"
                ? "IN PREPARATION"
                : tab === "plans"
                  ? "PLANNING"
                  : "DRAFT ORDERS"}
            </span>
          </div>
          {project.sample && (
            <div className="sample-banner">
              <span>
                <CircleHelp size={15} /> Sample purchase · fictional suppliers
                and prices
              </span>
              <button onClick={() => setReplace("new")}>
                Use your own quotes <ArrowUpRight size={14} />
              </button>
            </div>
          )}
          {saveError && (
            <div className="alert error" role="alert">
              {saveError}
            </div>
          )}
          <nav className="workflow-tabs" aria-label="Purchase workflow">
            <button
              className={tab === "quotes" ? "active" : ""}
              onClick={() => setTab("quotes")}
            >
              <span>01</span> Supplier quotes <b>{project.quotes.length}</b>
            </button>
            <button
              className={tab === "plans" ? "active" : ""}
              onClick={() => setTab("plans")}
            >
              <span>02</span> Buying plans{" "}
              {planned && <b>{result.plans.length}</b>}
            </button>
            <button
              className={tab === "drafts" ? "active" : ""}
              onClick={() => setTab("drafts")}
            >
              <span>03</span> Order drafts
            </button>
          </nav>
          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button
                className="icon-button"
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                <X size={14} />
              </button>
            </div>
          )}
          {tab === "quotes" && (
            <section className="quote-work">
              <div className="section-heading">
                <div>
                  <h2>Every quote has a story.</h2>
                  <p className="quiet">
                    Review pack prices, delivery and the fine print before
                    planning.
                  </p>
                </div>
                <button
                  className="button primary small"
                  disabled={
                    project.items.length === 0 || project.quotes.length >= 6
                  }
                  onClick={() => setImporting(true)}
                >
                  <Plus size={16} /> Add quote
                </button>
              </div>
              {project.items.length === 0 ? (
                <div className="empty-state">
                  <Package size={34} strokeWidth={1.2} />
                  <h3>What goes in this purchase?</h3>
                  <p>
                    Add the items, quantities and deadline. Then bring in your
                    supplier quotes.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => setBrief(true)}
                  >
                    Set up purchase <ArrowRight size={16} />
                  </button>
                </div>
              ) : project.quotes.length === 0 ? (
                <div className="empty-state">
                  <FileText size={34} strokeWidth={1.2} />
                  <h3>Your basket is ready for quotes.</h3>
                  <p>
                    Paste a supplier quote, import text or CSV, or enter
                    commercial terms yourself.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => setImporting(true)}
                  >
                    Add your first quote <Plus size={16} />
                  </button>
                </div>
              ) : (
                <div className="quotes-list">
                  {project.quotes.map((q, i) => {
                    const issues = quoteIssues(q, project);
                    return (
                      <article className="quote-sheet" key={q.id}>
                        <div className="quote-sheet-main">
                          <span
                            className="supplier-monogram"
                            style={{
                              background:
                                supplierColors[i % supplierColors.length],
                            }}
                          >
                            {q.supplier.slice(0, 1).toUpperCase()}
                          </span>
                          <div className="supplier-title">
                            <h3>{q.supplier}</h3>
                            <span>
                              {q.reference || "No reference"}{" "}
                              <span className="dot-separator">·</span>{" "}
                              {q.offers.length} of {project.items.length} items
                            </span>
                          </div>
                          <span
                            className={`pill ${issues.length ? "warning" : "success"}`}
                          >
                            {issues.length ? (
                              <AlertTriangle size={12} />
                            ) : (
                              <Check size={13} />
                            )}{" "}
                            {issues.length ? issues[0] : "Terms reviewed"}
                          </span>
                          <button
                            className="button small secondary"
                            onClick={() => setEditing(structuredClone(q))}
                          >
                            Review quote <ArrowUpRight size={14} />
                          </button>
                        </div>
                        <div className="quote-facts">
                          <div>
                            <span>DELIVERY</span>
                            <strong
                              className={
                                q.deliveryDate &&
                                q.deliveryDate > project.deadline
                                  ? "danger"
                                  : ""
                              }
                            >
                              {shortDate(q.deliveryDate)}
                            </strong>
                          </div>
                          <div>
                            <span>FREIGHT</span>
                            <strong>
                              {q.shippingCents === null
                                ? "Not stated"
                                : money(q.shippingCents, q.currency)}
                            </strong>
                          </div>
                          <div>
                            <span>TAX</span>
                            <strong>
                              {q.taxBps === null
                                ? "Not stated"
                                : q.taxBps / 100 + "%"}
                            </strong>
                          </div>
                          <div>
                            <span>ORDER MINIMUM</span>
                            <strong>
                              {q.minOrderCents === null
                                ? "Not stated"
                                : money(q.minOrderCents, q.currency)}
                            </strong>
                          </div>
                          <div>
                            <span>SOURCE</span>
                            <strong>
                              {q.origin === "serv"
                                ? "SERV extraction"
                                : q.origin === "sample"
                                  ? "Sample quote"
                                  : "Manual entry"}
                            </strong>
                          </div>
                        </div>
                        {issues.length > 0 && (
                          <div className="quote-warning">
                            {issues.join(" · ")}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
              <div className="planning-bar">
                <div>
                  <Layers3 size={21} />
                  <div>
                    <strong>
                      {confirmed} quote{confirmed === 1 ? "" : "s"} reviewed
                    </strong>
                    <span>
                      Compare the complete purchase, including the fine print.
                    </span>
                  </div>
                </div>
                <button
                  className="button primary"
                  disabled={!project.items.length || !project.quotes.length}
                  onClick={build}
                >
                  Build buying plans <ArrowRight size={17} />
                </button>
              </div>
              <p className="workspace-footnote">
                SERV interprets supplier text. You confirm the terms. Lotvale
                calculates the buying plans.
              </p>
            </section>
          )}
          {tab === "plans" &&
            (!planned ? (
              <div className="empty-state">
                <Layers3 size={34} strokeWidth={1.2} />
                <h3>Put the whole purchase together.</h3>
                <p>
                  Build complete baskets from your reviewed quotes, budget and
                  deadline.
                </p>
                <button
                  className="button primary"
                  disabled={!project.items.length || !project.quotes.length}
                  onClick={build}
                >
                  Build buying plans <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <PlanView
                project={project}
                result={result}
                selected={selected}
                onSelect={setSelectedId}
                onBrief={() => setBrief(true)}
                onQuotes={() => setTab("quotes")}
                onDrafts={() => setTab("drafts")}
              />
            ))}
          {tab === "drafts" &&
            (!planned || !selected ? (
              <div className="empty-state">
                <FileText size={34} strokeWidth={1.2} />
                <h3>Choose a buying plan first.</h3>
                <p>
                  Your supplier drafts use the exact quantities and costs in the
                  selected plan.
                </p>
                <button
                  className="button primary"
                  onClick={() => setTab("plans")}
                >
                  Go to buying plans <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <DraftView
                project={project}
                plan={selected}
                onBuyer={(buyer) => {
                  setProject({ ...project, buyer });
                  setDirty(true);
                }}
              />
            ))}
        </main>
      </div>
      {brief && (
        <BriefEditor
          project={project}
          onClose={() => setBrief(false)}
          onSave={(p) => {
            update(p);
            setBrief(false);
            setNotice(
              "Purchase brief updated. Rebuild buying plans to use the new requirements.",
            );
          }}
        />
      )}
      {importing && (
        <QuoteImporter
          project={project}
          onClose={() => setImporting(false)}
          onReview={(q) => {
            setImporting(false);
            setEditing(q);
          }}
        />
      )}
      {editing && (
        <QuoteEditor
          project={project}
          quote={editing}
          onClose={() => setEditing(null)}
          onSave={saveQuote}
          onDelete={() => {
            update({
              ...project,
              quotes: project.quotes.filter((q) => q.id !== editing.id),
            });
            setEditing(null);
          }}
        />
      )}
      {replace && (
        <Modal
          title={
            replace === "new"
              ? "Start a new purchase?"
              : "Load the sample purchase?"
          }
          onClose={() => setReplace(null)}
        >
          <p className="modal-copy">
            This replaces the purchase saved in this browser. Download a backup
            first if you want to keep it.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() =>
                download(
                  "lotvale-project.json",
                  JSON.stringify(project, null, 2),
                  "application/json",
                )
              }
            >
              <Download size={16} /> Back up current purchase
            </button>
            <button
              className="button primary"
              onClick={() => {
                setProject(
                  replace === "sample" ? sampleProject() : emptyProject(),
                );
                setDirty(true);
                setTab("quotes");
                setPlanned(false);
                setSelectedId(null);
                setReplace(null);
                setNotice("");
              }}
            >
              {replace === "new" ? "Start fresh" : "Load sample"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
