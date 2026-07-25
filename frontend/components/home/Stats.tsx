type Stat = { label: string; value: string };

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
