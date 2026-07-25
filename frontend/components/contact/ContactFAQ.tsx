"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";
import { cn } from "@/lib/utils";

/* BEFORE YOU ASK — a small FAQ (brief §39–41).
   Every answer is grounded in real Kayease policy: the licence, refund and
   custom-work terms come straight from /terms; support routes to the real
   team inbox. Nothing here invents a policy. Full-width accordion rows, no
   cards; + rotates to × and the answer expands from height 0. */

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Can I customise a theme?",
    a: (
      <>
        Yes. Your licence lets you customise a theme for your end product — see
        the{" "}
        <Link href="/terms" className="ed-underline text-(--ed-ink)">
          licence terms
        </Link>{" "}
        for the details.
      </>
    ),
  },
  {
    q: "Do you take on custom projects?",
    a: (
      <>
        We do. Custom work is scoped individually, and the timeline,
        deliverables and pricing are agreed in writing before anything begins.
        Choose <span className="text-(--ed-ink)">Custom project</span> above to
        start.
      </>
    ),
  },
  {
    q: "Can I use a theme on more than one website?",
    a: (
      <>
        A licence covers a single end product. For a second site you&apos;ll
        need a separate licence — the full terms are on our{" "}
        <Link href="/terms" className="ed-underline text-(--ed-ink)">
          Terms of Service
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    q: "What if a theme isn't working as described?",
    a: (
      <>
        Get in touch within 14 days of purchase. If a theme is materially broken
        or not as described, we&apos;ll work with you to fix it or arrange a
        refund. Pick <span className="text-(--ed-ink)">Technical support</span>{" "}
        above and tell us what&apos;s happening.
      </>
    ),
  },
];

function Row({
  item,
  index,
  open,
  onToggle,
}: {
  item: (typeof FAQ)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-(--ed-line) first:border-t">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-4 py-7 text-left sm:gap-x-6 lg:grid-cols-[4.5rem_1fr_auto] lg:gap-x-8"
      >
        <span className="text-[11px] font-medium tabular-nums tracking-[0.14em] text-(--ed-ink-2)">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "ed-display text-[clamp(1.15rem,2.4vw,1.9rem)] transition-colors",
            open ? "text-(--ed-ink)" : "text-(--ed-ink)/80"
          )}
        >
          {item.q}
        </span>
        <Plus
          className={cn(
            "size-5 text-(--ed-ink) transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open && "rotate-135"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 pl-8 text-[15px] leading-relaxed text-(--ed-ink-2) sm:pl-0 lg:pl-18">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="ed-px mx-auto w-full max-w-[1760px] pt-[clamp(6rem,10vw,10rem)]">
      <div className="border-t border-(--ed-line) pt-14">
        <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel>04 / Before you ask</SectionLabel>
            <MaskedLines
              as="h2"
              lines={["You might", "find it here."]}
              className="ed-display mt-6 text-[clamp(2.25rem,5vw,4.5rem)]"
            />
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2) lg:col-span-4 lg:justify-self-end lg:text-right">
            A few quick answers before you reach out. Anything else — the form
            is right above.
          </p>
        </div>

        <div>
          {FAQ.map((item, i) => (
            <Row
              key={item.q}
              item={item}
              index={i}
              open={open === i}
              onToggle={() => setOpen((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
