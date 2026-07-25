"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { EASE } from "@/lib/motion";
import MaskedLines from "@/components/motion/MaskedLines";
import Magnetic from "@/components/motion/Magnetic";
import TextRoll from "@/components/motion/TextRoll";
import { SectionLabel } from "@/components/home/editorial";
import type { Theme } from "@/lib/types";
import {
  BUDGETS,
  BUILD_TYPES,
  EMAIL_RE,
  EMPTY_FIELDS,
  TIMELINES,
  buildContactPayload,
  type ContactFields,
  type Intent,
} from "./intents";
import { UnderlineField, UnderlineTextarea } from "./UnderlineField";
import OptionSelector from "./OptionSelector";
import ThemePicker from "./ThemePicker";

/* MAIN FORM — fields live directly on the page, on lines, never in a card
   (brief §14–16). The set of fields adapts to the chosen intent; the message
   placeholder is contextual; and the whole area MORPHS into a designed
   success state on send (§31). Submission wraps the existing /contacts API
   untouched — the rich UI is folded back into name/email/subject/message. */

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<keyof ContactFields, string>>;

export default function ContactForm({
  intent,
  themes,
}: {
  intent: Intent;
  themes: Theme[];
}) {
  const reduced = useReducedMotion();
  const [f, setF] = useState<ContactFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof ContactFields, v: string) => {
    setF((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!f.firstName.trim()) next.firstName = "Please add your first name.";
    if (!f.email.trim()) next.email = "Please add your email.";
    else if (!EMAIL_RE.test(f.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!f.message.trim()) next.message = "Please add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return; // guard against duplicate submits
    if (!validate()) return;

    setStatus("sending");
    try {
      await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify(buildContactPayload(intent, f)),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  // ---- SUCCESS: the form area is replaced, not toasted over (§31–32) ----
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="min-h-[60vh] pt-4"
      >
        <motion.span
          aria-hidden
          initial={{ scaleX: reduced ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="block h-px w-full origin-left bg-(--ed-ink)/25"
        />
        <SectionLabel className="mt-10">02 / Sent</SectionLabel>
        <MaskedLines
          as="h2"
          mode="mount"
          delay={0.25}
          lines={["Message sent.", "We'll take it", "from here."]}
          className="ed-display mt-6 text-[clamp(2.5rem,7vw,6rem)]"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="mt-8 max-w-md text-[15px] leading-relaxed text-(--ed-ink-2)"
        >
          Thanks for reaching out
          {f.firstName ? `, ${f.firstName.trim()}` : ""}. Your message is with
          the Kayease team — we&apos;ll reply to{" "}
          <span className="text-(--ed-ink)">{f.email.trim()}</span> as soon as
          we can.
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
            Send another message
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // ---- FORM ----
  return (
    <form onSubmit={handleSubmit} noValidate className="pt-2">
      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
        <UnderlineField
          label="First name"
          name="firstName"
          autoComplete="given-name"
          required
          value={f.firstName}
          onChange={(v) => set("firstName", v)}
          error={errors.firstName}
        />
        <UnderlineField
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          value={f.lastName}
          onChange={(v) => set("lastName", v)}
        />
        <UnderlineField
          label="Email"
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
        <UnderlineField
          label="Company / brand"
          name="company"
          autoComplete="organization"
          value={f.company}
          onChange={(v) => set("company", v)}
        />
      </div>

      {/* ---- contextual fields: they morph as the intent changes (§47) ---- */}
      <AnimatePresence mode="wait" initial={false}>
        {(intent.themeLabel || intent.projectFields) && (
          <motion.div
            key={intent.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-11 space-y-11"
          >
            {intent.themeLabel && (
              <ThemePicker
                label={intent.themeLabel}
                themes={themes}
                value={f.theme}
                onChange={(v) => set("theme", v)}
              />
            )}
            {intent.projectFields && (
              <>
                <OptionSelector
                  label="What are you building?"
                  name="buildType"
                  options={BUILD_TYPES}
                  value={f.buildType}
                  onChange={(v) => set("buildType", v)}
                />
                <div className="grid gap-x-10 gap-y-11 sm:grid-cols-2">
                  <OptionSelector
                    label="Budget in mind?"
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- message ---- */}
      <div className="mt-11">
        <UnderlineTextarea
          label="Your message"
          name="message"
          required
          placeholder={intent.messagePrompt}
          value={f.message}
          onChange={(v) => set("message", v)}
          error={errors.message}
        />
      </div>

      {/* ---- submit: a proper ending to the form, not a tiny button (§28) ---- */}
      <div className="mt-14 flex flex-col gap-8 border-t border-(--ed-line) pt-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <MaskedLines
            as="p"
            lines={["Ready when", "you are."]}
            className="ed-display text-[clamp(1.75rem,3.5vw,3rem)]"
          />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-(--ed-ink-2)">
            We&apos;ll get back to you as soon as we can.
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
          <Magnetic className="inline-block">
            <button
              type="submit"
              disabled={status === "sending"}
              className="group inline-flex h-13 items-center gap-2.5 bg-(--ed-ink) px-7 text-[13px] font-medium uppercase tracking-[0.14em] text-(--ed-bg) transition-colors duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-80 dark:hover:bg-white"
            >
              {status === "sending" ? (
                <>
                  <span>Sending</span>
                  <motion.span
                    aria-hidden
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    …
                  </motion.span>
                </>
              ) : (
                <>
                  <TextRoll>
                    {status === "error" ? "Try again" : "Send enquiry"}
                  </TextRoll>
                  <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </Magnetic>
        </div>
      </div>
    </form>
  );
}
