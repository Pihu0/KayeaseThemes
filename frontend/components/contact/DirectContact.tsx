"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import MaskedLines from "@/components/motion/MaskedLines";
import { SectionLabel } from "@/components/home/editorial";

/* NOT A FORM PERSON? — alternative ways to reach us (brief §35–38).
   Rows, not cards. Only real, in-repo contact data is used: team@kayease.com
   (Footer + Terms) and the GitHub profile already linked in the Footer.
   No invented support/business inboxes, socials, phone or address. */

const EMAIL = "team@kayease.com";
const GITHUB = "https://github.com/Pihu0";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard blocked — the mailto link still works */
        }
      }}
      className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-(--ed-ink-2) transition-colors hover:text-(--ed-ink)"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function DirectContact() {
  return (
    <section className="ed-px mx-auto w-full max-w-[1760px] pt-[clamp(6rem,10vw,10rem)]">
      <div className="border-t border-(--ed-line) pt-14 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel>03 / Prefer email?</SectionLabel>
          <MaskedLines
            as="h2"
            lines={["Not a form", "person?"]}
            className="ed-display mt-6 text-[clamp(2.25rem,5vw,4.5rem)]"
          />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-(--ed-ink-2)">
            Reach us directly and a real person will read it. We keep our inbox
            simple — one address, straight to the team.
          </p>
        </div>

        <div className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
          {/* Email */}
          <div className="border-t border-(--ed-line) py-7">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-(--ed-ink-2)">
                General &amp; support
              </span>
              <CopyButton value={EMAIL} />
            </div>
            <a
              href={`mailto:${EMAIL}`}
              className="ed-underline group mt-3 inline-flex items-center gap-2 text-(--ed-ink)"
            >
              <span className="ed-display text-[clamp(1.35rem,3vw,2.25rem)] normal-case">
                {EMAIL}
              </span>
              <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* GitHub */}
          <div className="border-y border-(--ed-line) py-7">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-(--ed-ink-2)">
              Follow the work
            </span>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="ed-underline group mt-3 inline-flex items-center gap-2 text-(--ed-ink)"
            >
              <span className="ed-display text-[clamp(1.35rem,3vw,2.25rem)]">
                GitHub
              </span>
              <ArrowUpRight className="size-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
