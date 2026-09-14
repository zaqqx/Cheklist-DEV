"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "A_FAIRE", label: "À faire" },
  { value: "TERMINE", label: "Terminé" },
];

type Props = { assignees: string[] };

export default function TaskFilters({ assignees }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <select
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-auto"
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
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-auto"
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
    </div>
  );
}
