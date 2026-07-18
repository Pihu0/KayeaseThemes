"use client";

import { motion } from "motion/react";
import { MagneticText } from "@/components/MagneticText";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="mb-14 text-center">
      {/* Real H1 for SEO + screen readers; the magnetic effect below is
          decorative (aria-hidden) and shows the same words. */}
      <h1 className="sr-only">Premium Website Themes</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        aria-hidden="true"
        className="flex justify-center"
      >
        <MagneticText
          text="Premium Website Themes"
          hoverText="Built by Kayease"
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty"
      >
        Production-ready templates for every project — beautifully designed,
        fully responsive, and ready to launch.
      </motion.p>
    </section>
  );
}
