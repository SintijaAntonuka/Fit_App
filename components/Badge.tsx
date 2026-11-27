import type { ReactNode } from "react";

const stile = {
  aktiv: "bg-aktiv-soft text-aktiv",
  pausiert: "bg-pausiert-soft text-pausiert",
  gekuendigt: "bg-gekuendigt-soft text-gekuendigt",
  neutral: "bg-surface-sunken text-muted",
  akzent: "bg-accent-soft text-accent-ink",
} as const;

export function Badge({
  ton = "neutral",
  children,
}: {
  ton?: keyof typeof stile;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${stile[ton]}`}
    >
      {children}
    </span>
  );
}

/** Mitgliedsstatus als farbiges Badge (aktiv / pausiert / gekündigt). */
export function StatusBadge({ status }: { status: string }) {
  const texte: Record<string, string> = {
    aktiv: "Aktiv",
    pausiert: "Pausiert",
    gekuendigt: "Gekündigt",
  };
  const ton =
    status === "aktiv" ? "aktiv" : status === "pausiert" ? "pausiert" : "gekuendigt";
  return (
    <Badge ton={ton}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {texte[status] ?? status}
    </Badge>
  );
}
