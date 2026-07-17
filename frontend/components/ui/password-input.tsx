"use client";

import * as React from "react";
import { useId, useMemo, useState } from "react";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// The password policy. Keep these 5 rules in sync with the backend
// validator in backend/models/User.js — the backend is the source of truth.
const REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "At least 1 special character" },
];

export function checkStrength(pass: string) {
  return REQUIREMENTS.map((req) => ({ met: req.regex.test(pass), text: req.text }));
}

// True only when every rule passes — use this to gate form submission.
export function isStrongPassword(pass: string) {
  return REQUIREMENTS.every((req) => req.regex.test(pass));
}

function getStrengthColor(score: number) {
  if (score === 0) return "bg-border";
  if (score <= 1) return "bg-red-500";
  if (score <= 2) return "bg-orange-500";
  if (score <= 3) return "bg-amber-500";
  if (score <= 4) return "bg-green-500";
  return "bg-emerald-500";
}

function getStrengthText(score: number) {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak security";
  if (score <= 4) return "Medium security";
  return "Strong security";
}

type PasswordInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
>;

export function PasswordInput({
  label = "Password",
  value,
  onChange,
  className,
  ...props
}: PasswordInputProps) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  const strength = checkStrength(value);
  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          aria-describedby={`${id}-description`}
          className={cn("pe-9", className)}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        />
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls={id}
          onClick={() => setIsVisible((v) => !v)}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-none transition-colors hover:text-foreground focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {isVisible ? (
            <EyeOffIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <EyeIcon className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Segmented strength bar */}
      <div
        role="progressbar"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={REQUIREMENTS.length}
        aria-valuenow={strengthScore}
        className="mt-1 flex gap-1"
      >
        {REQUIREMENTS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              i < strengthScore ? getStrengthColor(strengthScore) : "bg-border"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p
          id={`${id}-description`}
          className="text-sm font-medium text-foreground"
        >
          {getStrengthText(strengthScore)}
        </p>
        <span className="text-xs text-muted-foreground">
          {strengthScore}/{REQUIREMENTS.length} met
        </span>
      </div>

      <ul aria-label="Password requirements" className="space-y-1.5">
        {strength.map((req) => (
          <li className="flex items-center gap-1.5" key={req.text}>
            {req.met ? (
              <CheckIcon className="size-3.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <XIcon className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
            )}
            <span
              className={cn(
                "text-xs transition-colors",
                req.met ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? " - met" : " - not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
