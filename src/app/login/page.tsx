import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Checklist</h1>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous pour accéder aux tâches</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
