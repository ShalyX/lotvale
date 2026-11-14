"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight, Search } from "lucide-react";
import { Brand } from "./brand";
import { authClient } from "@/lib/auth/client";
import { money, shortDate, type Project } from "@/lib/schema";
type Business = {
  id: string;
  name: string;
  currency: string;
  address: string;
  contact_email: string;
};
type Purchase = {
  id: string;
  document: Pick<Project, "title" | "currency" | "budgetCents" | "deadline"> & {
    itemCount: number;
    quoteCount: number;
    reviewedCount: number;
  };
  revision: number;
  updated_at: string;
};
const defaults = { name: "", currency: "USD", address: "", contact_email: "" };
export function BusinessDesk() {
  const [business, setBusiness] = useState<Business | null>(null),
    [purchases, setPurchases] = useState<Purchase[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [settings, setSettings] = useState(false),
    [query, setQuery] = useState(""),
    [title, setTitle] = useState(""),
    [creating, setCreating] = useState(false),
    [draft, setDraft] = useState(defaults);
  const [createId, setCreateId] = useState("");
  const [loaded, setLoaded] = useState(false);
  async function request(url: string, options?: RequestInit) {
    const r = await fetch(url, { cache: "no-store", ...options });
    const d = await r.json();
    if (r.status === 401) {
      window.location.assign("/auth/sign-in");
      throw Error("Please sign in.");
    }
    if (!r.ok) throw Error(d.error || "Could not load your workspace.");
    return d;
  }
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [b, p] = await Promise.all([
        request("/api/business"),
        request("/api/business/purchases"),
      ]);
      setBusiness(b.business);
      setDraft(b.business || defaults);
      setPurchases(p.purchases);
      setLoaded(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load your workspace.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    if (new URLSearchParams(window.location.search).has("new"))
      setCreating(true);
  }, []);
  async function saveBusiness(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await request("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      setBusiness(d.business);
      setSettings(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save your business.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const id = createId || crypto.randomUUID();
      setCreateId(id);
      const p = await request("/api/business/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      });
      window.location.assign("/business/purchases/" + p.id);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not create this purchase.",
      );
    } finally {
      setBusy(false);
    }
  }
  const visible = purchases.filter((p) =>
    p.document.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="business-entry">
      <header>
        <Link href="/" aria-label="Lotvale home">
          <Brand />
        </Link>
        <nav>
          <Link href="/app?sample=1">Sample purchase ↗</Link>
          <button
            onClick={async () => {
              setError("");
              try {
                const r = await authClient.signOut();
                if (r.error) throw Error("Could not sign out.");
                window.location.assign("/auth/sign-in");
              } catch {
                setError("Could not sign out. Please try again.");
              }
            }}
          >
            Sign out
          </button>
        </nav>
      </header>
      <main className="business-shell">
        {error && (
          <div className="business-error" role="alert">
            {error} <button onClick={() => void load()}>Retry loading</button>
          </div>
        )}
        {loading ? (
          <p aria-live="polite">Loading your business purchases…</p>
        ) : !loaded ? (
          <section>
            <h1>Your workspace is unavailable.</h1>
            <p>
              Retry loading your saved purchases. Nothing has been replaced.
            </p>
            <button className="button primary" onClick={() => void load()}>
              Load workspace again
            </button>
          </section>
        ) : !business || settings ? (
          <section className="business-setup">
            <span className="eyebrow">BUSINESS DETAILS</span>
            <h1>
              {business
                ? "Your purchasing defaults."
                : "Make room for your business."}
            </h1>
            <p>
              These details start each new purchase. Existing purchases keep
              their own buyer details.
            </p>
            <form onSubmit={saveBusiness}>
              <label>
                Business name
                <input
                  required
                  maxLength={160}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </label>
              <label>
                Default currency
                <input
                  required
                  pattern="[A-Z]{3}"
                  maxLength={3}
                  value={draft.currency}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      currency: e.target.value.toUpperCase(),
                    })
                  }
                />
              </label>
              <label>
                Buyer contact email
                <input
                  type="email"
                  maxLength={200}
                  value={draft.contact_email}
                  onChange={(e) =>
                    setDraft({ ...draft, contact_email: e.target.value })
                  }
                />
              </label>
              <label>
                Default delivery address
                <textarea
                  maxLength={1000}
                  value={draft.address}
                  onChange={(e) =>
                    setDraft({ ...draft, address: e.target.value })
                  }
                />
              </label>
              <div className="business-actions">
                <button className="button primary" disabled={busy}>
                  {busy
                    ? "Saving…"
                    : business
                      ? "Save business details"
                      : "Create business workspace"}
                </button>
                {business && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setSettings(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        ) : (
          <>
            <div className="business-heading">
              <div>
                <span className="eyebrow">{business.name} / BUYING DESK</span>
                <h1>Every purchase, in view.</h1>
                <p>
                  Bring the quotes together. Decide with the whole order in
                  mind.
                </p>
              </div>
              <button
                className="button primary"
                onClick={() => {
                  setCreating(true);
                  setCreateId("");
                }}
              >
                <Plus size={18} />
                New purchase
              </button>
            </div>
            <div className="business-strip">
              <span>
                {purchases.length} saved purchase
                {purchases.length === 1 ? "" : "s"}
              </span>
              <span>Default currency · {business.currency}</span>
              <button
                onClick={() => {
                  setDraft(business);
                  setSettings(true);
                }}
              >
                Business details ↗
              </button>
            </div>
            {creating && (
              <form className="new-purchase-form" onSubmit={create}>
                <label>
                  Purchase name
                  <input
                    autoFocus
                    required
                    maxLength={160}
                    placeholder="e.g. Opening supplies — June"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
                <button className="button primary" disabled={busy}>
                  {busy ? "Creating…" : "Create purchase"}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  disabled={busy}
                  onClick={() => setCreating(false)}
                >
                  Cancel
                </button>
              </form>
            )}
            <div className="purchase-list-title">
              <h2>Purchases</h2>
              <label className="purchase-search">
                <Search size={17} />
                <span className="sr-only">Search purchases</span>
                <input
                  aria-label="Search purchases"
                  placeholder="Find a purchase"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            {purchases.length === 0 ? (
              <section className="business-empty">
                <span className="empty-rule" />
                <h2>Your next order starts here.</h2>
                <p>
                  Create a purchase, set its budget and deadline, then bring in
                  your supplier quotes.
                </p>
                <button
                  className="button secondary"
                  onClick={() => {
                    setCreating(true);
                    setCreateId("");
                  }}
                >
                  Create your first purchase <ArrowUpRight size={17} />
                </button>
                <p className="quiet">
                  Want to explore first?{" "}
                  <Link href="/app?sample=1">Try the fictional sample</Link>.
                </p>
              </section>
            ) : visible.length === 0 ? (
              <p>No purchases match “{query}”.</p>
            ) : (
              <div className="purchase-list">
                {visible.map((p) => (
                  <Link
                    key={p.id}
                    href={"/business/purchases/" + p.id}
                    className="purchase-row"
                  >
                    <div>
                      <h3>{p.document.title}</h3>
                      <span>
                        {p.document.itemCount} items · {p.document.quoteCount}{" "}
                        quotes · {p.document.reviewedCount} reviewed
                      </span>
                    </div>
                    <div>
                      <small>Budget</small>
                      <strong>
                        {money(p.document.budgetCents, p.document.currency)}
                      </strong>
                    </div>
                    <div>
                      <small>Needed by</small>
                      <strong>{shortDate(p.document.deadline)}</strong>
                    </div>
                    <div>
                      <small>Last saved</small>
                      <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                    </div>
                    <ArrowUpRight size={20} />
                  </Link>
                ))}
              </div>
            )}
            <p className="business-footnote">
              Purchases save to your account when you choose Save purchase. Your
              sample workspace stays in this browser.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
