"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "A_FAIRE", label: "À faire" },
  { value: "TERMINE", label: "Terminé" },
];
const URGENCY_OPTIONS = [
  { value: "", label: "Toutes les urgences" },
  { value: "CRITIQUE", label: "Critique" },
  { value: "HAUTE", label: "Haute" },
  { value: "MOYENNE", label: "Moyenne" },
  { value: "BASSE", label: "Basse" },
];

type Props = { assignees: string[]; resultCount?: number };

export default function TaskFilters({ assignees, resultCount }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(params.toString() ? `/?${params.toString()}` : "/");
  }

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <input
        type="search"
        placeholder="Rechercher une tâche..."
        defaultValue={searchParams.get("search") ?? ""}
        onKeyDown={(event) => {
          if (event.key === "Enter") updateParam("search", event.currentTarget.value);
        }}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm lg:col-span-2"
      />
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        value={searchParams.get("status") ?? ""}
        onChange={(event) => updateParam("status", event.target.value)}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        value={searchParams.get("assignedTo") ?? ""}
        onChange={(event) => updateParam("assignedTo", event.target.value)}
      >
        <option value="">Tous les assignés</option>
        {assignees.map((assignee) => (
          <option key={assignee} value={assignee}>
            {assignee}
          </option>
        ))}
      </select>
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        value={searchParams.get("urgency") ?? ""}
        onChange={(event) => updateParam("urgency", event.target.value)}
      >
        {URGENCY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        value={searchParams.get("due") ?? ""}
        onChange={(event) => updateParam("due", event.target.value)}
      >
        <option value="">Toutes les échéances</option>
        <option value="overdue">En retard</option>
        <option value="without">Sans échéance</option>
      </select>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-500">{resultCount !== undefined ? `${resultCount} résultat${resultCount > 1 ? "s" : ""}` : ""}</span>
        {hasFilters && <button type="button" onClick={() => router.push("/")} className="text-xs font-medium text-blue-700 hover:underline">Réinitialiser les filtres</button>}
      </div>
    </div>
  );
}
