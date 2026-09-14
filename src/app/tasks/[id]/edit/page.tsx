import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAssignees, getTaskById } from "@/lib/actions/tasks";
import TaskForm from "@/components/TaskForm";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const task = await getTaskById(id);
  if (!task) {
    notFound();
  }

  const assignees = await getAssignees();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <h1 className="text-xl font-semibold text-gray-900">Modifier la tâche</h1>
      <TaskForm assignees={assignees} task={task} />
    </div>
  );
}
