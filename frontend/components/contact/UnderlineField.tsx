"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/* UNDERLINE FIELD — the whole form is built from lines, not boxes (brief §16).
   A label that lifts and tightens on focus, a baseline that fills left→right
   on focus (scaleX via a pseudo-underline), and an inline error that turns the
   line red without shaking anything. Real <input>/<textarea> underneath so
   autofill, autocomplete and keyboard behaviour stay native (§53–54). */

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
};

function Frame({
  label,
  htmlFor,
  focused,
  filled,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  focused: boolean;
  filled: boolean;
  error?: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  const lifted = focused || filled;
  return (
    <div className={cn("group relative", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "block text-[11px] font-medium uppercase transition-all duration-300 ease-out",
          lifted ? "tracking-[0.2em]" : "tracking-[0.14em]",
          error
            ? "text-[#b4231f]"
            : focused
              ? "text-(--ed-ink)"
              : "text-(--ed-ink-2)"
        )}
      >
        {label}
      </label>

      {children}

      {/* baseline: idle line + focus line that draws in from the left */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px",
          error ? "bg-[#b4231f]/50" : "bg-(--ed-ink)/18"
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]",
          error ? "bg-[#b4231f]" : "bg-(--ed-ink)",
          focused ? "scale-x-100" : "scale-x-0"
        )}
      />

      {error && (
        <p className="mt-2 text-[12px] leading-snug text-[#b4231f]">{error}</p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent pt-2.5 pb-2.5 text-[clamp(1rem,1.6vw,1.15rem)] text-(--ed-ink) placeholder:text-(--ed-ink-2)/60 outline-none";

export function UnderlineField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  autoComplete,
  placeholder,
  type = "text",
  inputMode,
  className,
}: BaseProps & {
  type?: string;
  inputMode?: "text" | "email" | "url";
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  return (
    <Frame
      label={label}
      htmlFor={id}
      focused={focused}
      filled={value.length > 0}
      error={error}
      className={className}
    >
      <input
        id={id}
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
        className={inputCls}
      />
    </Frame>
  );
}

export function UnderlineTextarea({
  label,
  name,
  value,
  onChange,
  error,
  required,
  placeholder,
  className,
}: BaseProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  return (
    <Frame
      label={label}
      htmlFor={id}
      focused={focused}
      filled={value.length > 0}
      error={error}
      className={className}
    >
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        className={cn(inputCls, "min-h-[190px] resize-y leading-relaxed")}
      />
    </Frame>
  );
}
