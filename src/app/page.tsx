import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAssignees, getTasks } from "@/lib/actions/tasks";
import TaskList from "@/components/TaskList";
import TaskFilters from "@/components/TaskFilters";
import SignOutButton from "@/components/SignOutButton";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; assignedTo?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const [tasks, assignees] = await Promise.all([
    getTasks({ status: params.status, assignedTo: params.assignedTo }),
    getAssignees(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Checklist</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/tasks/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nouvelle tâche
          </Link>
          <SignOutButton />
        </div>
      </header>

      <TaskFilters assignees={assignees} />

      <TaskList tasks={tasks} />
    </div>
  );
}

