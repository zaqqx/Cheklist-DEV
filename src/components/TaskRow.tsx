"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import UrgencyBadge from "@/components/UrgencyBadge";
import { deleteTask, toggleTaskStatus } from "@/lib/actions/tasks";
import type { TaskWithRelations } from "@/types/task";

const STATUS_LABELS: Record<string, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
};

export default function TaskRow({ task }: { task: TaskWithRelations }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useState(task.status);
  const [isDeleted, setIsDeleted] = useState(false);

  const isDone = optimisticStatus === "TERMINE";
  const isOverdue = !isDone && task.deadline !== null && new Date(task.deadline) < new Date();

  function handleToggle() {
    setError(null);
    const previousStatus = optimisticStatus;
    const nextStatus = isDone ? "A_FAIRE" : "TERMINE";
    setOptimisticStatus(nextStatus);
    startTransition(async () => {
      const result = await toggleTaskStatus(task.id, nextStatus);
      if (!result.success) {
        setOptimisticStatus(previousStatus);
        setError(result.error);
      }
    });
  }

  function handleDelete() {
    const taskLabel = task.cabCode || task.siteName || task.siteUrl;
    if (!confirm(`Supprimer la tâche ${taskLabel} ?`)) {
      return;
    }
    setError(null);
    setIsDeleted(true);
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (!result.success) {
        setIsDeleted(false);
        setError(result.error);
      }
    });
  }

  if (isDeleted) {
    return null;
  }

  return (
    <li className={`flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:gap-4 ${isDone ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"}`}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={handleToggle}
        disabled={isPending}
        aria-label="Marquer comme terminé"
        className="h-5 w-5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />

      <div className="flex flex-1 flex-wrap items-center gap-2">
        {task.cabCode && (
          task.cabLink ? (
            <a
              href={task.cabLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium text-blue-700 hover:underline ${isDone ? "line-through opacity-60" : ""}`}
            >
              {task.cabCode}
            </a>
          ) : (
            <span className={`font-medium ${isDone ? "line-through opacity-60" : ""}`}>{task.cabCode}</span>
          )
        )}

        {task.siteUrl && (
          <a
            href={task.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm text-blue-600 hover:underline ${isDone ? "line-through opacity-60" : ""}`}
          >
            {task.siteName || task.siteUrl}
          </a>
        )}

        <UrgencyBadge urgency={task.urgency} />

        <span className="text-xs text-gray-500">{STATUS_LABELS[task.status]}</span>

        {task.deadline && (
          <span className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-gray-500"}`}>
            {isOverdue ? "⚠ " : ""}
            {new Date(task.deadline).toLocaleDateString("fr-FR")}
          </span>
        )}

        {task.assignedTo && (
          <span className="text-xs text-gray-500">→ {task.assignedTo}</span>
        )}
      </div>

      <div className="flex shrink-0 gap-2">
        <Link
          href={`/tasks/${task.id}/edit`}
          className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Modifier
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
        >
          Supprimer
        </button>
      </div>

      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </li>
  );
}
