"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, User, Briefcase, Palette, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { SectionLabel, EdButton } from "@/components/home/editorial";
import {
  BUILD_TYPES,
  BUDGETS,
  TIMELINES,
  EMAIL_RE,
  EMPTY_FIELDS,
  buildContactPayload,
  type CustomDesignFields,
} from "./intents";

/* ─── CUSTOM DESIGN FORM ─────────────────────────────────────────────
   Redesigned as a stepped card-based form with grouped sections,
   glassmorphic containers, and premium polish. Structured into three
   clear sections: About You, Project Details, Your Vision.
   Submission wraps the existing /contacts API untouched.
──────────────────────────────────────────────────────────────────── */

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<keyof CustomDesignFields, string>>;

/* ─── STEP HEADER ───────────────────────────────────────────────── */
function StepHeader({
  step,
  icon: Icon,
  title,
  subtitle,
}: {
  step: number;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--ed-ink)/8 text-(--ed-ink-2) dark:bg-white/[0.06]">
        <Icon className="size-[18px]" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-(--ed-ink-2)/60">
          Step {step}
        </p>
        <h3 className="mt-0.5 text-lg font-semibold tracking-tight text-(--ed-ink) dark:text-(--ed-ink-on-dark)">
          {title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ─── SECTION CARD ──────────────────────────────────────────────── */
function FormCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className="rounded-2xl border border-(--ed-line) bg-(--ed-card) p-6 backdrop-blur-sm sm:p-8"
    >
      {children}
    </motion.div>
  );
}

/* ─── TEXT INPUT ─────────────────────────────────────────────────── */
function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  required?: boolean;
  type?: string;
  inputMode?: "text" | "email" | "url";
  autoComplete?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={`cf-${name}`}
        className={`mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
          error
            ? "text-[#ef4444]"
            : focused
              ? "text-(--ed-ink) dark:text-(--ed-ink-on-dark)"
              : "text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)"
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#ef4444]">*</span>}
      </label>
      <input
        id={`cf-${name}`}
        name={name}
        type={type}
        inputMode={inputMode}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full rounded-lg border bg-transparent px-4 py-3 text-[15px] text-(--ed-ink) outline-none transition-all duration-200 placeholder:text-(--ed-ink-2)/40 dark:text-(--ed-ink-on-dark) ${
          error
            ? "border-[#ef4444]/60"
            : focused
              ? "border-(--ed-ink)/30 shadow-[0_0_0_3px_var(--ed-ink)/0.06] dark:border-white/25 dark:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
              : "border-(--ed-line) hover:border-(--ed-ink)/20 dark:hover:border-white/15"
        }`}
      />
      {error && (
        <p className="mt-1.5 text-[12px] text-[#ef4444]">{error}</p>
      )}
    </div>
  );
}

/* ─── TEXTAREA ──────────────────────────────────────────────────── */
function FormTextarea({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={`cf-${name}`}
        className={`mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${
          error
            ? "text-[#ef4444]"
            : focused
              ? "text-(--ed-ink) dark:text-(--ed-ink-on-dark)"
              : "text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)"
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#ef4444]">*</span>}
      </label>
      <textarea
        id={`cf-${name}`}
        name={name}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        className={`w-full resize-y rounded-lg border bg-transparent px-4 py-3 text-[15px] leading-relaxed text-(--ed-ink) outline-none transition-all duration-200 placeholder:text-(--ed-ink-2)/40 dark:text-(--ed-ink-on-dark) ${
          error
            ? "border-[#ef4444]/60"
            : focused
              ? "border-(--ed-ink)/30 shadow-[0_0_0_3px_var(--ed-ink)/0.06] dark:border-white/25 dark:shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
              : "border-(--ed-line) hover:border-(--ed-ink)/20 dark:hover:border-white/15"
        }`}
      />
      {error && (
        <p className="mt-1.5 text-[12px] text-[#ef4444]">{error}</p>
      )}
    </div>
  );
}

/* ─── PILL OPTION SELECTOR ──────────────────────────────────────── */
function PillSelector({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
        {label}
      </legend>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-2.5"
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              name={name}
              onClick={() => onChange(active ? "" : opt)}
              className={`rounded-full border px-4 py-2 text-[12.5px] font-medium tracking-[0.04em] transition-all duration-300 ${
                active
                  ? "border-transparent bg-(--ed-ink) text-(--ed-bg) shadow-md shadow-(--ed-ink)/15 dark:bg-white dark:text-(--ed-dark)"
                  : "border-(--ed-line) text-(--ed-ink-2) hover:border-(--ed-ink)/30 hover:bg-(--ed-ink)/[0.04] hover:text-(--ed-ink) dark:text-(--ed-ink-2-on-dark) dark:hover:border-white/20 dark:hover:bg-white/[0.04] dark:hover:text-(--ed-ink-on-dark)"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN FORM COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

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

  // ──── SUCCESS STATE ────
  if (status === "success") {
    return (
      <div className="pt-2">
        <FormCard delay={0}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex min-h-[45vh] flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-(--ed-ink)/5 text-(--ed-ink) dark:bg-white/10 dark:text-white"
            >
              <CheckCircle2 className="size-8" />
            </motion.div>

            <MaskedLines
              as="h2"
              mode="mount"
              delay={0.25}
              lines={["Your vision is", "in good hands."]}
              className="ed-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] tracking-tight"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
              className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)"
            >
              Thanks for sharing your project
              {f.fullName ? `, ${f.fullName.trim().split(" ")[0]}` : ""}. The
              Kayease team will review your brief and get back to{" "}
              <span className="font-medium text-(--ed-ink)">{f.email.trim()}</span> within 24–48
              hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
              className="mt-10 flex flex-col items-center gap-y-4"
            >
              <Magnetic className="inline-block">
                <Link
                  href="/themes"
                  className="group inline-flex h-12 w-full max-w-xs items-center justify-center gap-2.5 rounded-full bg-(--ed-ink) px-8 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-all duration-300 hover:scale-105 hover:bg-black dark:hover:bg-white sm:w-auto"
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
                className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2) transition-colors hover:text-(--ed-ink)"
              >
                Submit another request
              </button>
            </motion.div>
          </motion.div>
        </FormCard>
      </div>
    );
  }

  // ──── FORM ────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-2">
      {/* ─── STEP 1: ABOUT YOU ─── */}
      <FormCard delay={0}>
        <StepHeader
          step={1}
          icon={User}
          title="About you"
          subtitle="Let us know who we'll be working with."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput
            label="Full name"
            name="fullName"
            autoComplete="name"
            required
            value={f.fullName}
            onChange={(v) => set("fullName", v)}
            error={errors.fullName}
          />
          <FormInput
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
        <div className="mt-5">
          <FormInput
            label="Business / brand name"
            name="company"
            autoComplete="organization"
            placeholder="Your company or brand"
            value={f.company}
            onChange={(v) => set("company", v)}
          />
        </div>
      </FormCard>

      {/* ─── STEP 2: PROJECT DETAILS ─── */}
      <FormCard delay={0.1}>
        <StepHeader
          step={2}
          icon={Briefcase}
          title="Project details"
          subtitle="Help us understand the scope of your project."
        />
        <div className="space-y-6">
          <PillSelector
            label="What are you building?"
            name="buildType"
            options={BUILD_TYPES}
            value={f.buildType}
            onChange={(v) => set("buildType", v)}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <PillSelector
              label="Budget range"
              name="budget"
              options={BUDGETS}
              value={f.budget}
              onChange={(v) => set("budget", v)}
            />
            <PillSelector
              label="Timeline"
              name="timeline"
              options={TIMELINES}
              value={f.timeline}
              onChange={(v) => set("timeline", v)}
            />
          </div>
        </div>
      </FormCard>

      {/* ─── STEP 3: YOUR VISION ─── */}
      <FormCard delay={0.15}>
        <StepHeader
          step={3}
          icon={Palette}
          title="Your vision"
          subtitle="Describe your dream website — the more detail, the better."
        />
        <FormTextarea
          label="Tell us everything"
          name="message"
          required
          placeholder="The vibe, features, pages, references, colour palette, brands you admire — anything that helps us understand what you're looking for…"
          value={f.message}
          onChange={(v) => set("message", v)}
          error={errors.message}
        />
      </FormCard>

      {/* ─── SUBMIT ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="flex flex-col gap-8 rounded-2xl border border-(--ed-line) bg-(--ed-card) p-6 backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between sm:p-8"
      >
        <div>
          <MaskedLines
            as="h3"
            lines={["Let's make it", "happen."]}
            className="ed-display text-[clamp(1.75rem,3.5vw,3rem)]"
          />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
            We&apos;ll review your brief and get back within 24–48 hours.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          {status === "error" && (
            <div role="alert" className="max-w-xs text-[13px] sm:text-right">
              <p className="font-medium uppercase tracking-[0.14em] text-[#ef4444]">
                We couldn&apos;t send that.
              </p>
              <p className="mt-1 text-(--ed-ink-2) dark:text-(--ed-ink-2-on-dark)">
                Your message is still here — please try again.
              </p>
            </div>
          )}
          <EdButton
            type="submit"
            disabled={status === "sending"}
            icon={<ArrowUpRight className="size-4" />}
          >
            {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Send request"}
          </EdButton>
        </div>
      </motion.div>
    </form>
  );
}
