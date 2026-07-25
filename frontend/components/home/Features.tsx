import { Rocket, Smartphone, Search, LifeBuoy } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Production-ready",
    description:
      "Clean, well-structured code you can ship the same day — no messy rewrites.",
  },
  {
    icon: Smartphone,
    title: "Fully responsive",
    description:
      "Every theme looks sharp on mobile, tablet, and desktop out of the box.",
  },
  {
    icon: Search,
    title: "SEO-ready",
    description:
      "Semantic markup, metadata, and fast loads so you rank from day one.",
  },
  {
    icon: LifeBuoy,
    title: "Real support",
    description:
      "Documentation with every theme and a team that actually answers.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Why teams choose Kayease
        </h2>
        <p className="mt-3 text-muted-foreground text-pretty">
          Themes built the way you&apos;d build them yourself — only faster.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-primary transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
