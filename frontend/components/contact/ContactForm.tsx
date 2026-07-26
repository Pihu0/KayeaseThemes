"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { AnimatedButton } from "@/components/ui/animated-button";
import { SectionLabel } from "@/components/home/editorial";
import {
  BUILD_TYPES,
  BUDGETS,
  TIMELINES,
  EMAIL_RE,
  EMPTY_FIELDS,
  buildContactPayload,
  type CustomDesignFields,
} from "./intents";
import { UnderlineField, UnderlineTextarea } from "./UnderlineField";
import OptionSelector from "./OptionSelector";

/* CUSTOM DESIGN FORM — streamlined for a single purpose: requesting
   a custom theme. Fields: name, email, brand, build type (pills),
   budget (pills), timeline (pills), and a vision textarea. The form
   area MORPHS into a designed success state on send. Submission wraps
   the existing /contacts API untouched. */

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<keyof CustomDesignFields, string>>;

export default function ContactForm() {
  const reduced = useReducedMotion();
  const [f, setF] = useState<CustomDesignFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof CustomDesignFields, v: string) => {
    setF((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!f.fullName.trim()) next.fullName = "Please add your name.";
    if (!f.email.trim()) next.email = "Please add your email.";
    else if (!EMAIL_RE.test(f.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!f.message.trim()) next.message = "Please tell us about your vision.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;

    setStatus("sending");
    try {
      await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify(buildContactPayload(f)),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // ---- SUCCESS STATE ----
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="min-h-[50vh] pt-4"
      >
        <motion.span
          aria-hidden
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="block h-px w-full origin-left bg-(--ed-ink)/25"
        />
        <SectionLabel className="mt-10">Sent</SectionLabel>
        <MaskedLines
          as="h2"
          mode="mount"
          delay={0.25}
          lines={["Your vision is", "in good hands."]}
          className="ed-display mt-6 text-[clamp(2.25rem,5vw,4.5rem)]"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="mt-8 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)"
        >
          Thanks for sharing your project
          {f.fullName ? `, ${f.fullName.trim().split(" ")[0]}` : ""}. The
          Kayease team will review your brief and get back to{" "}
          <span className="text-(--ed-ink)">{f.email.trim()}</span> within 24–48
          hours.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4"
        >
          <Magnetic className="inline-block">
            <Link
              href="/themes"
              className="group inline-flex h-12 items-center gap-2.5 bg-(--ed-ink) px-6 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black dark:hover:bg-white"
            >
              <TextRoll>Explore themes</TextRoll>
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
          <button
            type="button"
            onClick={() => {
              setF(EMPTY_FIELDS);
              setStatus("idle");
            }}
            className="ed-underline text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2) transition-colors hover:text-(--ed-ink)"
          >
            Submit another request
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // ---- FORM ----
  return (
    <form onSubmit={handleSubmit} noValidate className="pt-2">
      {/* name + email row */}
      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <UnderlineField
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          value={f.fullName}
          onChange={(v) => set("fullName", v)}
          error={errors.fullName}
        />
        <UnderlineField
          label="Email address"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={f.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
        />
      </div>

      {/* brand name */}
      <div className="mt-9">
        <UnderlineField
          label="Business / brand name"
          name="company"
          autoComplete="organization"
          placeholder="Your company or brand"
          value={f.company}
          onChange={(v) => set("company", v)}
        />
      </div>

      {/* pill selectors */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        className="mt-11 space-y-11"
      >
        <OptionSelector
          label="What are you building?"
          name="buildType"
          options={BUILD_TYPES}
          value={f.buildType}
          onChange={(v) => set("buildType", v)}
        />
        <div className="grid gap-x-10 gap-y-11 sm:grid-cols-2">
          <OptionSelector
            label="Budget range"
            name="budget"
            options={BUDGETS}
            value={f.budget}
            onChange={(v) => set("budget", v)}
          />
          <OptionSelector
            label="Timeline"
            name="timeline"
            options={TIMELINES}
            value={f.timeline}
            onChange={(v) => set("timeline", v)}
          />
        </div>
      </motion.div>

      {/* vision textarea */}
      <div className="mt-11">
        <UnderlineTextarea
          label="Your vision"
          name="message"
          required
          placeholder="Describe your dream website — the vibe, features, pages, references, anything that helps us understand what you're looking for…"
          value={f.message}
          onChange={(v) => set("message", v)}
          error={errors.message}
        />
      </div>

      {/* submit */}
      <div className="mt-14 flex flex-col gap-8 border-t border-(--ed-line) pt-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <MaskedLines
            as="h3"
            lines={["Let's make it", "happen."]}
            className="ed-display text-[clamp(1.75rem,3.5vw,3rem)]"
          />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-(--ed-ink-2)">
            We&apos;ll review your brief and get back within 24–48 hours.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          {status === "error" && (
            <div role="alert" className="max-w-xs text-[13px] sm:text-right">
              <p className="font-medium uppercase tracking-[0.14em] text-[#b4231f]">
                We couldn&apos;t send that.
              </p>
              <p className="mt-1 text-(--ed-ink-2)">
                Your message is still here — please try again.
              </p>
            </div>
          )}
          <AnimatedButton
            type="submit"
            disabled={status === "sending"}
            icon={<ArrowUpRight className="size-4" />}
          >
            {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Send request"}
          </AnimatedButton>
        </div>
      </div>
    </form>
  );
}
