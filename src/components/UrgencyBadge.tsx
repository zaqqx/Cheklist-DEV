import type { Urgency } from "@/types/task";

const STYLES: Record<Urgency, string> = {
  BASSE: "bg-green-100 text-green-800 border-green-300",
  MOYENNE: "bg-yellow-100 text-yellow-800 border-yellow-300",
  HAUTE: "bg-orange-100 text-orange-800 border-orange-300",
  CRITIQUE: "bg-red-100 text-red-800 border-red-300",
};

const LABELS: Record<Urgency, string> = {
  BASSE: "Basse",
  MOYENNE: "Moyenne",
  HAUTE: "Haute",
  CRITIQUE: "Critique",
};

export default function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[urgency]}`}
    >
      {LABELS[urgency]}
    </span>
  );
}
