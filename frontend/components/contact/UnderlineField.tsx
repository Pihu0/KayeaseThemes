"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/* FORM FIELD — boxed inputs so the custom-design brief reads as a proper form:
   a static uppercase label above a bordered field that lifts its border and
   picks up a soft focus ring on focus, and turns red inline on error. Real
   <input>/<textarea> underneath so autofill, autocomplete and keyboard
   behaviour stay native. */

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
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  focused: boolean;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "mb-2 block text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200",
          error ? "text-[#b4231f]" : focused ? "text-(--ed-ink)" : "text-(--ed-ink-2)"
        )}
      >
        {label}
        {required && <span className="ml-1 text-[#b4231f]">*</span>}
      </label>

      <div
        className={cn(
          "rounded-lg border bg-(--ed-surface)/40 transition-all duration-200",
          error
            ? "border-[#b4231f]/70"
            : focused
              ? "border-(--ed-ink)/45 ring-2 ring-(--ed-ink)/10"
              : "border-(--ed-line) hover:border-(--ed-ink)/25"
        )}
      >
        {children}
      </div>

      {error && (
        <p className="mt-2 text-[12px] leading-snug text-[#b4231f]">{error}</p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent px-4 py-3 text-[15px] text-(--ed-ink) placeholder:text-(--ed-ink-2)/60 outline-none";

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
      error={error}
      required={required}
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
      error={error}
      required={required}
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
        className={cn(inputCls, "min-h-40 resize-y leading-relaxed")}
      />
    </Frame>
  );
}
