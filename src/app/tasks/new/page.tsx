import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getDevs } from "@/lib/actions/devs";
import TaskForm from "@/components/TaskForm";

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const assignees = await getDevs();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <h1 className="text-xl font-semibold text-gray-900">Nouvelle tâche</h1>
      <TaskForm assignees={assignees} />
    </div>
  );
}
