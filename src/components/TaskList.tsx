import TaskRow from "@/components/TaskRow";
import type { TaskWithRelations } from "@/types/task";

export default function TaskList({ tasks }: { tasks: TaskWithRelations[] }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500">Aucune tâche ne correspond aux filtres.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </ul>
  );
}
