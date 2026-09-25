"use client";

import { useEffect, useState } from "react";
import TaskRow from "@/components/TaskRow";
import type { TaskWithRelations } from "@/types/task";

export default function TaskList({ tasks }: { tasks: TaskWithRelations[] }) {
  const [settings, setSettings] = useState({ compact: false, showDescriptions: true, confirmDelete: true });

  useEffect(() => {
    const stored = window.localStorage.getItem("checklist-settings");
    if (stored) {
      try {
        setSettings((current) => ({ ...current, ...JSON.parse(stored) }));
      } catch {
        window.localStorage.removeItem("checklist-settings");
      }
    }
  }, []);

  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500">Aucune tâche ne correspond aux filtres.</p>;
  }

  return (
    <ul className={`flex flex-col ${settings.compact ? "gap-1.5" : "gap-3"}`}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} settings={settings} />
      ))}
    </ul>
  );
}
