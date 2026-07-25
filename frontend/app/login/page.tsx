"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsDesktop } from "@/lib/motion";

/* KAYEASE — ADMIN AUTHENTICATION
   A private workspace entrance: a fixed dark/light split (independent of the
   global next-themes toggle — this is a deliberate art direction, spec §46).
   Authentication reuses the existing email/password + JWT flow untouched;
   admin authorization stays enforced server-side (protect + admin middleware)
   and in the /admin route guard. This page only redesigns the door. */

const EASE = [0.16, 1, 0.3, 1] as const;

// Only ever redirect to an in-app path — never an attacker-supplied absolute URL.
function safeInternalPath(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/\\")) {
    return path;
  }
  return null;
}

export default function AdminLoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  // Resolve where to go after auth. Honour a validated ?redirect=, else the
  // admin dashboard for admins / the public site for everyone else.
  const resolveTarget = (role: string) => {
    const requested =
      typeof window !== "undefined"
        ? safeInternalPath(new URLSearchParams(window.location.search).get("redirect"))
        : null;
    if (requested) return requested;
    return role === "admin" ? "/admin" : "/";
  };

  // Session-expiry continuity: /admin sends ?reason=session when a session ends.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason === "session") setSessionEnded(true);
  }, []);

  // An already-authenticated admin landing here goes straight to the workspace.
  useEffect(() => {
    if (!authLoading && user?.role === "admin") {
      router.replace(resolveTarget(user.role));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || success) return; // block repeat submissions
    setError(false);
    setSubmitting(true);
    try {
      await login(email, password);
      // Auth succeeded server-side before we treat the user as signed in.
      let role = "user";
      try {
        const stored = localStorage.getItem("user");
        if (stored) role = JSON.parse(stored).role ?? role;
      } catch {
        /* fall back to public redirect */
      }
      const target = resolveTarget(role);
      setSuccess(true); // plays the panel-wipe transition
      window.setTimeout(() => router.replace(target), prefersReduced ? 0 : 560);
    } catch {
      // Generic failure only — never reveal whether an admin email exists.
      setSubmitting(false);
      setError(true);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-[#f5f4f0] lg:flex-row">
      {/* ─────────────────────────  LEFT · DARK BRAND  ───────────────────────── */}
      <section className="relative flex shrink-0 flex-col overflow-hidden bg-[#0b0b0b] px-6 py-8 text-[#f4f3ef] sm:px-10 lg:h-screen lg:w-[59%] lg:px-14 lg:py-12">
        <Backdrop isDesktop={isDesktop} prefersReduced={!!prefersReduced} />

        {/* Top row: wordmark + back-to-website */}
        <div className="relative z-10 flex items-center justify-between">
          <motion.span
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-[var(--font-display)] text-lg font-semibold tracking-tight"
          >
            KAYEASE<sup className="top-[-0.5em] text-[0.5em]">®</sup>
          </motion.span>

          <Link
            href="/"
            className="ed-underline inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#98978f] transition-colors hover:text-[#f4f3ef]"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to website
          </Link>
        </div>

        {/* Centre statement */}
        <div className="relative z-10 flex flex-1 flex-col justify-center py-12 lg:py-0">
          <MaskedLines
            lines={["PRIVATE", "WORKSPACE."]}
            prefersReduced={!!prefersReduced}
            className="ed-display text-[clamp(2.75rem,7vw,6.5rem)]"
          />
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
            className="mt-6 max-w-xs text-sm leading-relaxed text-[#98978f]"
          >
            Internal access for the Kayease team.
          </motion.p>
        </div>

        {/* Bottom metadata */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          className="relative z-10 flex items-end justify-between gap-4"
        >
          <div className="ed-label leading-relaxed text-[#98978f]">
            <div className="text-[#f4f3ef]">
              KAYEASE<sup className="top-[-0.5em] text-[0.6em]">®</sup> / ADMIN PORTAL
            </div>
            <div>Authorized personnel only</div>
          </div>
          <div className="ed-label hidden text-right text-[#6e6e68] sm:block">
            Internal system / 2026
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────  RIGHT · LIGHT AUTH  ──────────────────────── */}
      <section className="relative flex flex-1 flex-col bg-[#f5f4f0] px-6 py-10 text-[#111111] sm:px-10 lg:h-screen lg:overflow-y-auto lg:px-16">
        {/* Top-right micro label */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="ed-label flex justify-end text-[#8a8a86]"
        >
          Admin access
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10"
        >
          <p className="ed-label text-[#8a8a86]">Admin / Authentication</p>
          <h1 className="ed-display mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-[0.95]">
            Welcome
            <br />
            back.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#5f5f5a]">
            Sign in to continue to the Kayease administration workspace.
          </p>

          {sessionEnded && (
            <div className="mt-6 border-l-2 border-[#111] bg-[#ecebe6] px-4 py-3 text-xs leading-relaxed text-[#3a3a37]">
              <span className="font-semibold uppercase tracking-[0.12em]">
                Your session has ended.
              </span>{" "}
              Sign in again to continue.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-9 space-y-7" noValidate>
            <Field
              id="email"
              label="Admin email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={setEmail}
              placeholder="admin@kayease.com"
              disabled={submitting || success}
            />

            <div className="group">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="ed-label text-[#8a8a86] transition-colors group-focus-within:text-[#111]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8a8a86] transition-colors hover:text-[#111]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <UnderlineInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(v) => setPassword(v)}
                onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                onKeyDown={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
                placeholder="••••••••••••"
                disabled={submitting || success}
              />
              <div className="mt-2 h-4">
                <AnimatePresence>
                  {pwFocused && capsOn && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#a04a2f]"
                    >
                      Caps Lock is on
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Inline, calm error — no alert card, no field enumeration */}
            <div aria-live="polite">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="border-l-2 border-[#a04a2f] pl-3 text-xs leading-relaxed text-[#5f5f5a]"
                  >
                    <span className="font-semibold uppercase tracking-[0.12em] text-[#111]">
                      We couldn&apos;t sign you in.
                    </span>
                    <br />
                    Check your credentials and try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={submitting || success}
              className="group relative flex h-[54px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#111111] text-sm font-medium uppercase tracking-[0.18em] text-[#f5f4f0] transition-colors duration-300 hover:bg-[#232323] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-2">
                {success
                  ? "Authenticated"
                  : submitting
                    ? "Authenticating"
                    : "Enter workspace"}
                {submitting && !success ? (
                  <AuthenticatingDots />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </span>
            </button>

            {/* Honest access-help line — not a dead password-reset link */}
            <p className="text-center text-[11px] text-[#8a8a86]">
              Trouble signing in?{" "}
              <a
                href="mailto:team@kayease.com"
                className="ed-underline text-[#5f5f5a] transition-colors hover:text-[#111]"
              >
                Contact the team
              </a>
            </p>
          </form>

          {/* Private-system notice */}
          <div className="mt-10 flex items-start gap-2.5 border-t border-[rgba(17,17,17,0.1)] pt-6">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8a8a86]" />
            <p className="text-[11px] leading-relaxed text-[#8a8a86]">
              <span className="font-semibold uppercase tracking-[0.14em] text-[#5f5f5a]">
                Private system.
              </span>{" "}
              Access is restricted to authorized Kayease administrators.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Success panel-wipe: light surface sweeps across, then we navigate */}
      <AnimatePresence>
        {success && !prefersReduced && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f4f0]"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="ed-label text-[#8a8a86]"
            >
              Authenticated
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── Masked line-by-line reveal for the big statement ────────────────────── */
function MaskedLines({
  lines,
  prefersReduced,
  className,
}: {
  lines: string[];
  prefersReduced: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={line} className="overflow-hidden">
          <motion.div
            initial={prefersReduced ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.09 }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ── Faint architectural browser-window outlines + grid, with a tiny,
      desktop-only pointer parallax (≈6px). Purely decorative. ───────────── */
function Backdrop({
  isDesktop,
  prefersReduced,
}: {
  isDesktop: boolean;
  prefersReduced: boolean;
}) {
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 90, damping: 20 });
  const y = useSpring(mvY, { stiffness: 90, damping: 20 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!isDesktop || prefersReduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mvX.set(nx * 12); // ±6px
    mvY.set(ny * 12);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Barely-there grid */}
      <div
        className="absolute inset-0 opacity-[0.9]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />
      {/* Nested "theme window" outlines */}
      <motion.svg
        style={{ x, y }}
        className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 800 600"
        fill="none"
      >
        {[0, 1, 2].map((i) => (
          <g key={i} stroke="#f4f3ef" strokeOpacity={0.06 - i * 0.012}>
            <rect
              x={200 - i * 70}
              y={140 - i * 46}
              width={400 + i * 140}
              height={320 + i * 92}
              rx={10}
              strokeWidth={1}
            />
            <line
              x1={200 - i * 70}
              y1={176 - i * 46}
              x2={600 + i * 70}
              y2={176 - i * 46}
              strokeWidth={1}
            />
          </g>
        ))}
      </motion.svg>
    </div>
  );
}

/* ── Editorial underline field (label + input together) ──────────────────── */
function Field({
  id,
  label,
  ...inputProps
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="ed-label mb-2 block text-[#8a8a86] transition-colors group-focus-within:text-[#111]"
      >
        {label}
      </label>
      <UnderlineInput id={id} name={id} {...inputProps} />
    </div>
  );
}

/* Transparent input with a border that animates scaleX(0→1) left→right on focus.
   Kept plain enough that password managers and autofill work normally. */
function UnderlineInput({
  id,
  name,
  type,
  value,
  onChange,
  autoComplete,
  autoFocus,
  placeholder,
  disabled,
  onKeyUp,
  onKeyDown,
  onFocus,
  onBlur,
}: {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <div className="group relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
        disabled={disabled}
        placeholder={placeholder}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full border-b border-[rgba(17,17,17,0.18)] bg-transparent pb-2 text-[15px] text-[#111] placeholder:text-[#b6b5ae] focus:outline-none disabled:opacity-60"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#111] transition-transform duration-300 ease-out group-focus-within:scale-x-100" />
    </div>
  );
}

/* Tiny animated ellipsis for the AUTHENTICATING… button state */
function AuthenticatingDots() {
  return (
    <span className="inline-flex w-4 justify-start gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-[3px] w-[3px] rounded-full bg-current"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
