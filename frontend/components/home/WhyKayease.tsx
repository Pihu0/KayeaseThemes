"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { Code, Heart, LifeBuoy, type LucideIcon } from "lucide-react";

type WhyBlock = {
  n: string;
  title: string;
  description: string;
  statValue: number;
  statLabel: string;
  icon: LucideIcon;
  isTop: boolean;
};

export type RealStats = {
  themes: number;
  categories: number;
  frameworks: number;
};

export default function WhyKayease({ stats }: { stats: RealStats }) {
  const blocks = [
    {
      n: "01",
      title: "Expert craftsmanship.",
      description: "Every line of code is meticulously written by our seasoned developers.",
      statValue: 15,
      statLabel: "Years combined experience",
      icon: Code,
      isTop: true,
    },
    {
      n: "02",
      title: "Client-centric approach.",
      description: "We partner with you closely to ensure your vision is realized perfectly.",
      statValue: 500,
      statLabel: "Happy clients globally",
      icon: Heart,
      isTop: false,
    },
    {
      n: "03",
      title: "End-to-end support.",
      description: "From initial concept to deployment and beyond, we've got you covered.",
      statValue: 24,
      statLabel: "Hour support response",
      icon: LifeBuoy,
      isTop: true,
    },
  ];

  return (
    <section 
      aria-label="Why Kayease" 
      className="bg-(--ed-bg) pt-16 pb-28 sm:pt-20 sm:pb-36 overflow-hidden relative"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 102, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 102, 255, 0.02) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }}
    >
      <div className="ed-px mx-auto max-w-[1400px]">
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="relative z-10 text-center text-[clamp(2.25rem,6vw,3.5rem)] font-bold tracking-tight text-(--ed-ink)"
        >
          Why Kayease
        </h2>
        <p className="relative z-10 mx-auto mt-5 max-w-xl px-6 text-center text-base leading-relaxed text-(--ed-ink-2) sm:text-lg dark:text-white/60">
          We are more than just a theme marketplace. We are a dedicated team of experts committed to building better digital experiences.
        </p>

        {/* Desktop Staggered Grid Timeline */}
        <div className="relative w-full h-[520px] hidden md:block mt-16">
          {/* Horizontal timeline line */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-(--primary)/20 -translate-y-1/2" />

          <div className="grid grid-cols-3 h-full relative z-10">
            {blocks.map((b, idx) => {
              const IconComponent = b.icon;
              return (
                <div key={b.n} className="relative flex flex-col justify-between h-full group">
                  {b.isTop ? (
                    <>
                      {/* Top half: Card */}
                      <div className="h-1/2 flex items-end justify-center pb-10">
                        <CardBody block={b} index={idx} icon={IconComponent} />
                      </div>
                      {/* Bottom half: Empty */}
                      <div className="h-1/2" />
                    </>
                  ) : (
                    <>
                      {/* Top half: Empty */}
                      <div className="h-1/2" />
                      {/* Bottom half: Card */}
                      <div className="h-1/2 flex items-start justify-center pt-10">
                        <CardBody block={b} index={idx} icon={IconComponent} />
                      </div>
                    </>
                  )}

                  {/* Connector Node */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
                    {b.isTop ? (
                      <>
                        {/* Vertical line pointing up to the card */}
                        <div className="w-[2px] bg-(--primary)/20 group-hover:bg-(--primary) h-10 absolute bottom-2 transition-all duration-300" />
                        {/* Dot */}
                        <div className="w-4 h-4 rounded-full border-4 border-(--primary)/30 group-hover:border-(--primary) bg-background z-20 -mt-2 shadow-sm transition-all duration-300" />
                      </>
                    ) : (
                      <>
                        {/* Dot */}
                        <div className="w-4 h-4 rounded-full border-4 border-(--primary)/30 group-hover:border-(--primary) bg-background z-20 -mt-2 shadow-sm transition-all duration-300" />
                        {/* Vertical line pointing down to the card */}
                        <div className="w-[2px] bg-(--primary)/20 group-hover:bg-(--primary) h-10 absolute top-2 transition-all duration-300" />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="relative w-full space-y-12 md:hidden pl-10 mt-12">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-(--primary)/20" />

          {blocks.map((b, idx) => {
            const IconComponent = b.icon;
            return (
              <div key={b.n} className="relative">
                {/* Dot */}
                <div className="absolute -left-[32px] top-6 w-3 h-3 rounded-full border-2 border-(--primary) bg-background z-20 shadow-xs" />
                <CardBody block={b} index={idx} icon={IconComponent} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CardBody({
  block,
  index,
  icon: Icon,
}: {
  block: WhyBlock;
  index: number;
  icon: LucideIcon;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: block.isTop ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      className="w-full max-w-[340px] rounded-3xl border border-border/80 bg-background/60 dark:bg-neutral-900/60 backdrop-blur-md p-6 shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:border-(--primary)/40 group relative z-10"
    >
      {/* Icon */}
      <div className="inline-flex items-center justify-center rounded-2xl bg-(--primary)/10 text-(--primary) p-3 transition-colors group-hover:bg-(--primary) group-hover:text-white duration-300">
        <Icon className="size-5" />
      </div>

      {/* Title */}
      <div className="mt-4 text-sm font-bold text-foreground group-hover:text-(--primary) transition-colors duration-300">
        {block.title}
      </div>

      {/* Description */}
      <div className="mt-1 text-xs text-muted-foreground group-hover:text-foreground/90 leading-relaxed transition-colors duration-300">
        {block.description}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-border/60" />

      {/* Stat Label */}
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-(--primary) transition-colors duration-300">
        {block.statLabel}
      </div>

      {/* Stat Value */}
      <div className="mt-1.5 text-4xl font-extrabold tracking-tight text-foreground group-hover:text-(--primary) transition-colors duration-300">
        <Counter value={block.statValue} />
      </div>
    </motion.div>
  );
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setAnimated(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduced]);

  const display = reduced ? value : animated;

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className="text-(--primary) ml-0.5">+</span>
    </span>
  );
}
