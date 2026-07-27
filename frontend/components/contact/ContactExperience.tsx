"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";
import ContactForm from "./ContactForm";

/* /customdesign — "Custom Design" page.
   A simple, single-purpose page: a compact hero and the enquiry form,
   nothing else competing for attention. Uses the site's editorial
   typography (ed-display, ed-label, MaskedLines) and motion language. */

export default function ContactExperience() {
  const reduced = useReducedMotion();

  // Lenis smooth scroll
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

  return (
    <MotionConfig reducedMotion="user">
      <div className="editorial relative bg-(--ed-surface) text-(--ed-ink) transition-colors duration-300 dark:bg-(--ed-dark) dark:text-(--ed-ink-on-dark)">
        <div className="ed-px mx-auto w-full max-w-220 pt-[clamp(8rem,14vw,11rem)] pb-[clamp(5rem,9vw,8rem)]">
          {/* ──── HERO ──── */}
          <header className="text-center">
            <SectionLabel>Custom Design / Kayease®</SectionLabel>
            <MaskedLines
              as="h1"
              mode="mount"
              delay={0.1}
              lines={["A website crafted", "around your brand."]}
              className="ed-display mx-auto mt-7 text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
              className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)"
            >
              Tell us your vision and we&apos;ll design a custom theme that&apos;s
              uniquely yours — from concept to production-ready code.
            </motion.p>
          </header>

          {/* ──── FORM ──── */}
          <motion.section
            aria-label="Custom design enquiry"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-16 border-t border-(--ed-line) pt-12"
          >
            <ContactForm />
          </motion.section>

          {/* ──── DIRECT EMAIL ──── */}
          <div className="mt-16 flex flex-col items-center gap-2 border-t border-(--ed-line) pt-12 text-center">
            <SectionLabel>Prefer direct email?</SectionLabel>
            <a
              href="mailto:team@kayease.com"
              className="ed-underline group mt-1 inline-flex items-center gap-2 text-(--ed-ink) dark:text-(--ed-ink-on-dark)"
            >
              <span className="ed-display text-[clamp(1.25rem,2.5vw,1.75rem)] normal-case">
                team@kayease.com
              </span>
              <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
