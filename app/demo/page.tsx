import Link from "next/link";
import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import styles from "./page.module.css";
export const metadata: Metadata = {
  title: "Lotvale — Before you place the order",
  description:
    "A two-minute product story, with the real SERV Reasoning quote-to-plan flow.",
};
export default function DemoPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="Lotvale home">
          <Brand />
        </Link>
        <Link href="/app?sample=1">Try the sample ↗</Link>
      </header>
      <main>
        <p className={styles.eyebrow}>
          THE TWO-MINUTE PRODUCT STORY · SERV HACKATHON 02
        </p>
        <h1>
          Before you place
          <br />
          the order.
        </h1>
        <p className={styles.intro}>
          Three supplier quotes. One opening date. See how Lotvale turns the
          fine print into a complete buying plan.
        </p>
        <video
          className={styles.video}
          controls
          playsInline
          preload="metadata"
          poster="/demo-poster.jpg"
          aria-label="Lotvale two-minute product demonstration"
        >
          <source
            src="https://github.com/ShalyX/lotvale/releases/download/demo-v1.0.0/lotvale-demo.mp4"
            type="video/mp4"
          />
          Your browser cannot play this video.{" "}
          <a href="https://github.com/ShalyX/lotvale/releases/download/demo-v1.0.0/lotvale-demo.mp4">
            Download the film
          </a>
          .
        </video>
        <p className={styles.note}>
          Recorded product footage with fictional suppliers and prices.
          Processing waits are shortened; the SERV request, review, plan and
          business save are real. Captions are included in the film.
        </p>
        <div className={styles.actions}>
          <Link className="button primary" href="/app?sample=1">
            Try a sample purchase ↗
          </Link>
          <a href="https://github.com/ShalyX/lotvale">Explore the source ↗</a>
          <Link href="/business">Business workspace ↗</Link>
        </div>
        <section className={styles.section}>
          <p className={styles.eyebrow}>TRY THE REAL SERV STEP</p>
          <h2>Import. Review. Build the plan.</h2>
          <p>
            The ready-made sample already contains reviewed quotes. To watch
            SERV interpret a fresh quote yourself, use this separate starting
            point:
          </p>
          <ol>
            <li>
              Download the{" "}
              <a href="/api/demo?kind=before-import">
                two-quote purchase backup
              </a>{" "}
              and the <a href="/api/demo?kind=quote">Counter Supply quote</a>.
              Dates are generated for today.
            </li>
            <li>
              Open the <Link href="/app">buying desk</Link> and use Restore to
              import the backup. Restore replaces the current browser-local
              purchase, so back up your own work first.
            </li>
            <li>
              Choose Add quote, import the text file and run SERV Reasoning.
              Review the extracted pack prices, freight, tax and delivery
              against the source, then confirm the terms.
            </li>
            <li>
              Build plans. The expected lowest complete on-time basket is{" "}
              <strong>$755.08</strong>. Choose it and download the supplier
              draft. No order is sent.
            </li>
          </ol>
          <p>
            New extraction uses the live SERV service and its available credits.
            The reviewed sample works independently if the provider is
            unavailable. This fixture uses the same fictional terms as the film;
            its dates move forward with the current date.
          </p>
        </section>
        <section className={styles.section}>
          <h2>What SERV contributes</h2>
          <p>
            SERV Reasoning reads the supplier language and matches quoted
            products to the basket. The buyer checks that interpretation.
            Lotvale then calculates complete baskets using confirmed prices,
            pack quantities, minimums, freight, tax and delivery dates.
          </p>
          <p>
            Business accounts add email verification, password recovery and
            cloud-saved purchases. The public sample remains available without
            signing in.
          </p>
          <details>
            <summary>Read the full narration</summary>
            <div className={styles.transcript}>
              <p>
                Imagine you're opening a café. You need cups, lids, sleeves and
                napkins delivered before opening day. You have an
                eight-hundred-and-fifty-dollar budget, and three suppliers have
                sent their quotes.
              </p>
              <p>
                One has the lowest pack prices, but arrives too late. The others
                have different pack sizes, delivery charges and minimum orders.
                Now you have to work out which complete order you can actually
                buy.
              </p>
              <p>
                That's what Lotvale helps you do. Start with what you need, your
                budget and your deadline. Then bring in the supplier quotes.
                Here's the quote from Counter Supply.
              </p>
              <p>
                When we ask Lotvale to interpret it, the supplier text goes to
                SERV Reasoning. SERV matches the quoted products to our basket
                and extracts the pack sizes, prices, freight, tax and dates into
                an editable draft. We can inspect those terms in the workspace.
              </p>
              <p>
                We check the draft against the original quote: a hundred cups
                per pack, twenty-eight dollars for freight, and delivery on
                November nineteenth. We review the remaining items and charges,
                then confirm the terms. SERV handles the interpretation; the
                buying decision stays with us.
              </p>
              <p>
                Lotvale can now compare complete buying plans, accounting for
                packs, minimums, freight, tax and delivery. Here, the lowest
                complete on-time plan is seven hundred and fifty-five dollars
                and eight cents. It covers all four items, fits the budget, and
                arrives two days before the deadline.
              </p>
              <p>
                From that plan, we prepare the matching supplier draft, with the
                quantities and full order total. The purchase can also be saved
                to a business account, ready to pick up later. Nothing is
                ordered automatically.
              </p>
              <p>
                Lotvale. Understand the whole purchase before you place the
                order.
              </p>
            </div>
          </details>
          <p>
            <a href="/demo-captions.srt" download>
              Download captions
            </a>{" "}
            ·{" "}
            <a href="https://github.com/ShalyX/lotvale/blob/main/JUDGE_GUIDE.md">
              Judge walkthrough
            </a>{" "}
            ·{" "}
            <a href="https://github.com/ShalyX/lotvale/releases/tag/demo-v1.0.0">
              Film release and editable assets
            </a>
          </p>
        </section>
      </main>
      <footer className={styles.footer}>
        Built by ElseMade · Open Track · No orders or payments are executed.
      </footer>
    </div>
  );
}
