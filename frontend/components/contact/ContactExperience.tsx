"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import {
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDown,
  Palette,
  MessageSquare,
  Rocket,
  ArrowUpRight,
} from "lucide-react";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import { AnimatedButton } from "@/components/ui/animated-button";
import { SectionLabel } from "@/components/home/editorial";
import ContactForm from "./ContactForm";

/* /contact — "Custom Design" page.
   A premium, single-purpose page for custom design requests.
   Utilizes the site's native editorial typography (ed-display, ed-label, MaskedLines)
   and smooth motion language. */

const PROCESS_STEPS = [
  {
    n: "01",
    icon: MessageSquare,
    title: "Share Your Vision",
    description:
      "Tell us about your brand, audience, and features. The more context you provide, the better the final output.",
  },
  {
    n: "02",
    icon: Palette,
    title: "We Design & Refine",
    description:
      "Our team crafts a custom theme tailored to your brand identity. We iterate until every detail is pixel-perfect.",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Launch Your Site",
    description:
      "Receive production-ready, fully responsive code built on Next.js, React & Tailwind CSS — ready to deploy.",
  },
];

export default function ContactExperience() {
  const reduced = useReducedMotion();
  const formRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Lenis smooth scroll setup
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
      <div className="editorial relative overflow-x-clip bg-(--ed-surface) text-(--ed-ink) transition-colors duration-300 dark:bg-(--ed-dark) dark:text-(--ed-ink-on-dark)">
        {/* background grain */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-70 opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ──── HERO ──── */}
        <header className="ed-px relative mx-auto flex min-h-[75vh] w-full max-w-[1760px] flex-col justify-center pt-[clamp(8rem,14vw,12rem)] pb-[clamp(3rem,6vw,5rem)]">
          <SectionLabel>Custom Design / Kayease®</SectionLabel>

          <div className="relative mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:items-end">
            <MaskedLines
              as="h1"
              mode="mount"
              delay={0.1}
              lines={["A website crafted", "around your brand."]}
              className="ed-display text-[clamp(2.75rem,7vw,7.5rem)] leading-[0.95] lg:col-span-8"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="lg:col-span-4 lg:justify-self-end lg:text-right"
            >
              <p className="max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark) lg:ml-auto">
                From concept to production-ready code — tell us your vision and
                we&apos;ll design a custom theme that&apos;s uniquely yours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6 lg:justify-end">
                <AnimatedButton
                  onClick={() =>
                    formRef.current?.scrollIntoView({
                      behavior: reduced ? "auto" : "smooth",
                    })
                  }
                  icon={<ArrowDown className="size-4" />}
                >
                  Start your project
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ──── PROCESS STEPS ──── */}
        <section
          aria-label="How it works"
          className="ed-px mx-auto w-full max-w-[1760px] pt-[clamp(4rem,7vw,7rem)] pb-[clamp(3rem,6vw,5rem)]"
        >
          <div className="mb-10 lg:mb-14">
            <SectionLabel>01 / How it works</SectionLabel>
            <MaskedLines
              as="h2"
              lines={["Three steps to", "your dream site."]}
              className="ed-display mt-6 text-[clamp(2.25rem,5vw,4.5rem)]"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isHovered = activeStep === i;
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                  className="group relative overflow-hidden border border-(--ed-line-soft) bg-(--ed-bg-soft) p-8 transition-all duration-500 hover:border-(--ed-ink)/30 dark:border-white/10 dark:bg-white/[0.02]"
                >
                  <div className="flex items-center justify-between">
                    <span className="ed-label text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
                      {step.n}
                    </span>
                    <Icon className="size-5 text-(--ed-ink-2) transition-colors duration-300 group-hover:text-(--ed-ink) dark:text-(--ed-ink-2-on-dark) dark:group-hover:text-white" />
                  </div>

                  <h3 className="ed-display mt-8 text-[clamp(1.25rem,2.2vw,1.75rem)] text-(--ed-ink) dark:text-(--ed-ink-on-dark)">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
                    {step.description}
                  </p>

                  {/* signature line underline on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-(--ed-ink) dark:bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ originX: 0 }}
                  />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ──── FORM SECTION ──── */}
        <section
          ref={formRef}
          aria-label="Custom design enquiry"
          className="ed-px mx-auto w-full max-w-[1760px] scroll-mt-28 pt-[clamp(4rem,7vw,7rem)] pb-[clamp(5rem,9vw,9rem)]"
        >
          <div className="border-t border-(--ed-line) pt-14 lg:grid lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <SectionLabel>02 / Tell us your vision</SectionLabel>
              <MaskedLines
                as="h2"
                lines={["A few details", "and we're there."]}
                className="ed-display mt-6 text-[clamp(2rem,4.5vw,3.75rem)]"
              />
              <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
                Fill in what you can — even a rough idea helps. We&apos;ll
                follow up with a proposal and clear timeline.
              </p>

              {/* editorial trust points */}
              <div className="mt-10 hidden space-y-4 lg:block">
                {[
                  "Response within 24 hours",
                  "No commitment until scope is agreed",
                  "Transparent pricing & deliverables",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="block size-1.5 rounded-full bg-(--ed-ink) dark:bg-white" />
                    <span className="text-[13px] uppercase tracking-[0.1em] text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ──── CLOSING DIRECT EMAIL ──── */}
        <section className="border-t border-(--ed-line) bg-[#101010] text-[#f4f4f0]">
          <div className="ed-px mx-auto flex max-w-[1760px] flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center">
            <div>
              <SectionLabel onDark>Prefer Direct Email?</SectionLabel>
              <p className="mt-2 text-[14px] text-[#98978f]">
                Reach out straight to our team inbox.
              </p>
            </div>
            <a
              href="mailto:team@kayease.com"
              className="ed-underline group inline-flex items-center gap-2 text-[#f4f4f0]"
            >
              <span className="ed-display text-[clamp(1.25rem,2.5vw,2rem)] normal-case">
                team@kayease.com
              </span>
              <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
