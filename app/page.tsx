import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  FileText,
  Layers3,
  PackageCheck,
} from "lucide-react";
import { Brand } from "@/components/brand";
export default function Home() {
  return (
    <div className="landing">
      <header className="site-header">
        <Link href="/" aria-label="Lotvale home">
          <Brand />
        </Link>
        <span className="header-descriptor">A clearer way to buy.</span>
        <Link className="button small secondary" href="/app">
          Open workspace <ArrowUpRight size={16} />
        </Link>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="tiny-square" /> PURCHASE PLANNING, ALL TOGETHER
            </span>
            <h1>
              Make the
              <br />
              whole order
              <br />
              <span>work.</span>
            </h1>
            <p>
              Three quotes. Different pack sizes. One deadline.
              <br className="desktop-break" /> Turn the fine print into a buying
              plan you can use.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/app?sample=1">
                Try a sample purchase <ArrowRight size={18} />
              </Link>
              <Link className="text-link" href="/app?new=1">
                Start with your quotes <ArrowUpRight size={16} />
              </Link>
            </div>
            <span className="quiet hero-note">
              Your workspace saves in this browser. No order is sent.
            </span>
          </div>
          <div className="hero-sheet">
            <div className="sheet-corner" />
            <div className="sheet-kicker">
              <span>THE COMPLETE PURCHASE</span>
              <span>01 / 03</span>
            </div>
            <div className="sheet-heading">
              <h2>
                The counter
                <br />
                opens Friday.
              </h2>
              <PackageCheck size={34} strokeWidth={1.25} />
            </div>
            <p className="quiet">One basket. Every detail accounted for.</p>
            <div className="illustrative-list">
              <div>
                <span className="sheet-dot oxide" />
                <span>Cups & lids</span>
                <b>24 packs each</b>
              </div>
              <div>
                <span className="sheet-dot sage" />
                <span>Paper sleeves</span>
                <b>12 packs</b>
              </div>
              <div>
                <span className="sheet-dot ochre" />
                <span>Recycled napkins</span>
                <b>8 packs</b>
              </div>
            </div>
            <div className="sheet-rule">
              <span>Shipping. Tax. Minimums. Delivery.</span>
              <Check size={17} />
            </div>
            <div className="sheet-bottom">
              <div>
                <span className="eyebrow">A WORKABLE ORDER</span>
                <strong>Ready to decide.</strong>
              </div>
              <div className="stamp">
                PLAN
                <br />
                THEN BUY
              </div>
            </div>
            <span className="illustration-label">
              ILLUSTRATIVE PURCHASE · EXPLORE THE SAMPLE
            </span>
          </div>
        </section>
        <section className="process-section">
          <div className="process-intro">
            <span className="eyebrow">FROM QUOTED TO ORDER-READY</span>
            <h2>
              Good buying is
              <br />
              in the details.
            </h2>
          </div>
          <div className="process-step">
            <span className="step-no">01</span>
            <FileText size={23} strokeWidth={1.4} />
            <h3>Bring the quotes.</h3>
            <p>
              Paste supplier terms or import text and CSV. Review the extracted
              prices against their source.
            </p>
          </div>
          <div className="process-step">
            <span className="step-no">02</span>
            <Layers3 size={23} strokeWidth={1.4} />
            <h3>See the whole basket.</h3>
            <p>
              Compare complete plans with pack quantities, freight, tax, minimum
              orders and your delivery date.
            </p>
          </div>
          <div className="process-step">
            <span className="step-no">03</span>
            <PackageCheck size={23} strokeWidth={1.4} />
            <h3>Leave with the orders.</h3>
            <p>
              Choose your plan and export supplier-specific drafts. Review them
              before placing an order.
            </p>
          </div>
        </section>
        <section className="landing-footnote">
          <p>
            Quote interpretation powered by SERV Reasoning.
            <br />
            <span className="quiet">
              Your prices and requirements stay editable. The numbers follow
              your confirmed terms.
            </span>
          </p>
          <Link className="text-link" href="/app?new=1">
            Plan your next purchase <ArrowRight size={17} />
          </Link>
        </section>
      </main>
      <footer className="site-footer">
        <Brand small />
        <span>Make the whole order work.</span>
        <span>Built by ElseMade · SERV Hackathon 02</span>
      </footer>
    </div>
  );
}
