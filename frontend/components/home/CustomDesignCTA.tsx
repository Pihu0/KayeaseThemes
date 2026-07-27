"use client";

import { EdButton } from "@/components/home/editorial";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Paintbrush, Code, Layout } from "lucide-react";
import { EASE } from "@/lib/motion";

export default function CustomDesignCTA() {
  return (
    <section 
      aria-label="Custom Design"
      className="relative overflow-hidden bg-[#0F172A] text-[#F8FAFC] py-24 sm:py-32 border-t border-white/10"
    >
      {/* ── background blueprint pattern & glow ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="ed-px mx-auto max-w-[1400px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ── left text content ── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              <Sparkles className="size-3.5 animate-pulse" />
              <span>Tailored Solutions</span>
            </div>

            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Want a Custom <br className="hidden sm:inline" />
              Design & Setup?
            </h2>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
              If our premium themes don&apos;t match your unique goals, our custom agency team is ready to build a bespoke, lightning-fast digital experience designed specifically for your brand.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <EdButton href="/customdesign" icon={<ArrowRight className="size-4" />}>
                Request a Custom Design
              </EdButton>
            </div>
          </div>

          {/* ── right animated graphic showcase ── */}
          <div className="lg:col-span-5 relative h-[320px] sm:h-[400px] flex items-center justify-center">
            
            {/* blueprint layout frame */}
            <div className="relative w-full max-w-[380px] aspect-square rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
              
              {/* status dots */}
              <div className="flex items-center gap-1.5 border-b border-slate-805/50 pb-4 mb-6">
                <span className="size-2 rounded-full bg-slate-800" />
                <span className="size-2 rounded-full bg-slate-800" />
                <span className="size-2 rounded-full bg-slate-800" />
              </div>

              {/* interactive modular boxes layout */}
              <div className="grid grid-cols-6 gap-3 h-[calc(100%-48px)]">
                
                {/* block 1 */}
                <motion.div 
                  initial={{ opacity: 0.3, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.8, delay: 0.1, ease: EASE, repeat: Infinity, repeatType: "reverse" }}
                  className="col-span-4 rounded-lg bg-blue-900/20 border border-blue-500/30 p-3 flex flex-col justify-between"
                >
                  <Layout className="size-5 text-blue-400" />
                  <span className="text-[10px] font-mono text-blue-300/60">Layout.wireframe</span>
                </motion.div>

                {/* block 2 */}
                <motion.div 
                  initial={{ opacity: 0.3, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, delay: 0.4, ease: EASE, repeat: Infinity, repeatType: "reverse" }}
                  className="col-span-2 rounded-lg bg-indigo-900/20 border border-indigo-500/30 p-3 flex items-center justify-center"
                >
                  <Paintbrush className="size-5 text-indigo-400" />
                </motion.div>

                {/* block 3 */}
                <motion.div 
                  initial={{ opacity: 0.3, y: -5 }}
                  animate={{ opacity: 1, y: 5 }}
                  transition={{ duration: 2.2, delay: 0.2, ease: EASE, repeat: Infinity, repeatType: "reverse" }}
                  className="col-span-2 rounded-lg bg-cyan-900/20 border border-cyan-500/30 p-3 flex items-center justify-center"
                >
                  <Code className="size-5 text-cyan-400" />
                </motion.div>

                {/* block 4 */}
                <motion.div 
                  initial={{ opacity: 0.3, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 2.1, delay: 0.5, ease: EASE, repeat: Infinity, repeatType: "reverse" }}
                  className="col-span-4 rounded-lg bg-slate-900 border border-slate-800 p-3 flex flex-col justify-between"
                >
                  <div className="h-1.5 w-1/2 bg-slate-800 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-800 rounded-full" />
                  <span className="text-[9px] font-mono text-slate-500">setup.config</span>
                </motion.div>

              </div>
              
            </div>
            
            {/* outer floating accent particles */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5 text-[10px] font-mono text-blue-400 flex items-center gap-1.5 shadow-xl backdrop-blur-md"
            >
              <span>60fps animations</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-1.5 text-[10px] font-mono text-indigo-400 flex items-center gap-1.5 shadow-xl backdrop-blur-md"
            >
              <span>custom_setup.config</span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
