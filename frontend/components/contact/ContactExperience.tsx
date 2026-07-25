"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowDown } from "lucide-react";
import { EASE, useIsDesktop } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";
import type { Theme } from "@/lib/types";
import { INTENTS, type IntentId } from "./intents";
import IntentSelector from "./IntentSelector";
import ContactForm from "./ContactForm";
import DirectContact from "./DirectContact";
import ContactFAQ from "./ContactFAQ";
import ClosingSection from "./ClosingSection";

/* /contact — "Start a conversation".
   The quietest page on the site: an editorial hero, an intent selector that
   tailors the form, the form itself on lines (not a card), direct email, a
   grounded FAQ, and a dark closing. Same shell as the homepage / categories /
   archive — Lenis smooth scroll, film grain, one motion language — so it
   belongs to the system rather than looking bolted on. */

export default function ContactExperience({ themes }: { themes: Theme[] }) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const [intent, setIntent] = useState<IntentId | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Shared Lenis setup (matches the other editorial pages).
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.115 });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);

  // Faint cursor light behind the hero type (§08) — desktop, non-reduced only.
  const lightEnabled = desktop && !reduced;
  const lx = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });
  const ly = useSpring(useMotionValue(0), { stiffness: 40, damping: 20 });

  const activeIntent = INTENTS.find((i) => i.id === intent) ?? null;

  const choose = (id: IntentId) => {
    const first = intent === null;
    setIntent(id);
    // On the first choice, bring the form into view.
    if (first) {
      requestAnimationFrame(() =>
        formRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        })
      );
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="editorial relative overflow-x-clip">
        <div aria-hidden className="fixed inset-0 -z-10 bg-(--ed-bg)" />
        {/* the same near-invisible film grain as the rest of the site */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-70 opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ---- 02 HERO ---- */}
        <header
          onMouseMove={
            lightEnabled
              ? (e) => {
                  // coordinates relative to the header, so the light tracks the
                  // cursor accurately regardless of scroll position
                  const r = e.currentTarget.getBoundingClientRect();
                  lx.set(e.clientX - r.left);
                  ly.set(e.clientY - r.top);
                }
              : undefined
          }
          className="ed-px relative mx-auto flex min-h-[78vh] w-full max-w-[1760px] flex-col justify-center pt-[clamp(9rem,15vw,14rem)] pb-[clamp(3rem,6vw,6rem)]"
        >
          {lightEnabled && (
            <motion.div
              aria-hidden
              style={{ left: lx, top: ly }}
              className="pointer-events-none absolute z-0 size-105 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.5]"
            >
              <div className="size-full rounded-full bg-[radial-gradient(circle,var(--brand-soft),transparent_65%)]" />
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="ed-label relative text-(--ed-ink-2)"
          >
            Contact / Kayease®
          </motion.p>

          <div className="relative mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:items-end">
            <MaskedLines
              as="h1"
              mode="mount"
              delay={0.12}
              lines={["Let's start", "a conversation."]}
              className="ed-display text-[clamp(3.25rem,8vw,9rem)] leading-[0.9] lg:col-span-8"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="lg:col-span-4 lg:justify-self-end lg:text-right"
            >
              <p className="max-w-xs text-[15px] leading-relaxed text-(--ed-ink-2) lg:ml-auto">
                Whether you&apos;re looking for the right theme, need a little
                help, or have something completely custom in mind — we&apos;d
                love to hear about it.
              </p>
              <button
                type="button"
                onClick={() =>
                  formRef.current?.scrollIntoView({
                    behavior: reduced ? "auto" : "smooth",
                  })
                }
                className="group mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-(--ed-ink)"
              >
                <span className="ed-underline">Start below</span>
                <ArrowDown className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </motion.div>
          </div>
        </header>

        {/* ---- 03 INTENT SELECTOR ---- */}
        <section
          aria-label="What can we help with?"
          className="ed-px mx-auto w-full max-w-[1760px] pt-[clamp(3rem,6vw,5rem)]"
        >
          <div className="mb-10 lg:mb-14">
            <SectionLabel>01 / Your enquiry</SectionLabel>
            <MaskedLines
              as="h2"
              lines={["What can we", "help with?"]}
              className="ed-display mt-6 text-[clamp(2.25rem,5vw,4.5rem)]"
            />
          </div>
          <IntentSelector selected={intent} onSelect={choose} />
        </section>

        {/* ---- 04 FORM ---- */}
        <section
          ref={formRef}
          aria-label="Tell us more"
          className="ed-px mx-auto w-full max-w-[1760px] scroll-mt-28 pt-[clamp(5rem,9vw,8.5rem)]"
        >
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <SectionLabel>02 / Tell us a little more</SectionLabel>
              <MaskedLines
                as="h2"
                lines={["A few details", "and we're there."]}
                className="ed-display mt-6 text-[clamp(2rem,4vw,3.5rem)]"
              />
              {activeIntent && (
                <motion.p
                  key={activeIntent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-6 max-w-xs text-[14px] leading-relaxed text-(--ed-ink-2)"
                >
                  {activeIntent.summary}
                </motion.p>
              )}
            </div>

            <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
              {activeIntent ? (
                <ContactForm intent={activeIntent} themes={themes} />
              ) : (
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIntent("other")}
                  className="w-full border-y border-(--ed-line) py-16 text-left"
                >
                  <p className="ed-display text-[clamp(1.25rem,2.4vw,1.85rem)] text-(--ed-ink)/70">
                    Pick what you&apos;re here for above —
                    <br className="hidden sm:block" /> or just start writing.
                  </p>
                  <span className="ed-underline mt-5 inline-block text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2)">
                    Start a general message
                  </span>
                </motion.button>
              )}
            </div>
          </div>
        </section>

        {/* ---- 05 DIRECT CONTACT ---- */}
        <DirectContact />

        {/* ---- 06 FAQ ---- */}
        <ContactFAQ />

        {/* ---- 07 CLOSING (dark) ---- */}
        <ClosingSection themes={themes} />
      </div>
    </MotionConfig>
  );
}
