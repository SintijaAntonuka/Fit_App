export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">
        FitZone Berlin
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Kursbuchung und Trainingsverwaltung
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted">
        Grundgerüst steht. Die ersten Abläufe entstehen mit den Features aus
        <span className="font-medium text-ink"> docs/backlog.md</span>.
      </p>
    </main>
  );
}
