"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { taskSchema } from "@/lib/validations/task";
import { createTask, fetchSiteNameAction, updateTask } from "@/lib/actions/tasks";
import { createDev } from "@/lib/actions/devs";
import type { TaskWithRelations } from "@/types/task";

const URGENCY_OPTIONS = [
  { value: "BASSE", label: "Basse" },
  { value: "MOYENNE", label: "Moyenne" },
  { value: "HAUTE", label: "Haute" },
  { value: "CRITIQUE", label: "Critique" },
];

function toDateInputValue(date: string | Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export default function TaskForm({
  assignees,
  task,
}: {
  assignees: string[];
  task?: TaskWithRelations;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [devs, setDevs] = useState(assignees);
  const [newDevName, setNewDevName] = useState("");
  const [isCreatingDev, setIsCreatingDev] = useState(false);
  const [detectedSiteName, setDetectedSiteName] = useState(task?.siteName ?? "");
  const [isDetecting, setIsDetecting] = useState(false);

  const [values, setValues] = useState({
    cabCode: task?.cabCode ?? "",
    cabLink: task?.cabLink ?? "",
    siteUrl: task?.siteUrl ?? "",
    siteName: task?.siteName ?? "",
    description: task?.description ?? "",
    urgency: task?.urgency ?? "MOYENNE",
    deadline: toDateInputValue(task?.deadline),
    assignedTo: task?.assignedTo ?? "",
  });

  function handleSiteUrlBlur() {
    if (!values.siteUrl) return;
    try {
      new URL(values.siteUrl);
    } catch {
      return;
    }
    setIsDetecting(true);
    startTransition(async () => {
      const name = await fetchSiteNameAction(values.siteUrl);
      setDetectedSiteName(name);
      setValues((current) => ({ ...current, siteName: name }));
      setIsDetecting(false);
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = taskSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Données invalides");
      return;
    }

    startTransition(async () => {
      const result = task ? await updateTask(task.id, values) : await createTask(values);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push("/");
    });
  }

  function handleAddDev() {
    const trimmed = newDevName.trim();
    if (!trimmed) return;
    setIsCreatingDev(true);
    startTransition(async () => {
      const result = await createDev(trimmed);
      setIsCreatingDev(false);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setDevs((current) => (current.includes(result.data) ? current : [...current, result.data].sort()));
      setValues((current) => ({ ...current, assignedTo: result.data }));
      setNewDevName("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Code CAB (optionnel)</label>
        <input
          type="text"
          value={values.cabCode}
          onChange={(event) => setValues({ ...values, cabCode: event.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="L4S000032"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Lien CAB (optionnel)</label>
        <input
          type="url"
          value={values.cabLink}
          onChange={(event) => setValues({ ...values, cabLink: event.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://espocrm.example.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Lien du site (optionnel)</label>
        <input
          type="url"
          value={values.siteUrl}
          onChange={(event) => setValues({ ...values, siteUrl: event.target.value })}
          onBlur={handleSiteUrlBlur}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://example.com"
        />
        {(isDetecting || detectedSiteName) && (
          <p className="mt-1 text-xs text-gray-500">
            {isDetecting ? "Détection du nom du site…" : `Nom détecté : ${detectedSiteName}`}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description / notes (optionnel)</label>
        <textarea
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
          rows={4}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Détails, contraintes, remarques..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Urgence</label>
        <select
          value={values.urgency}
          onChange={(event) => setValues({ ...values, urgency: event.target.value as typeof values.urgency })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {URGENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline (optionnel)</label>
        <input
          type="date"
          value={values.deadline}
          onChange={(event) => setValues({ ...values, deadline: event.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Assigné à (optionnel)</label>
        <select
          value={values.assignedTo}
          onChange={(event) => setValues({ ...values, assignedTo: event.target.value })}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">— Non assigné —</option>
          {devs.map((dev) => (
            <option key={dev} value={dev}>
              {dev}
            </option>
          ))}
        </select>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={newDevName}
            onChange={(event) => setNewDevName(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            placeholder="Nouveau dev"
          />
          <button
            type="button"
            onClick={handleAddDev}
            disabled={isCreatingDev || !newDevName.trim()}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Ajouter
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {task ? "Enregistrer" : "Créer la tâche"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
