"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="mb-14 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        Premium Website Themes
      </motion.h1>
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
