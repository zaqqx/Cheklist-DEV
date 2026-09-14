"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { extractSiteName } from "@/lib/site-name";
import { taskSchema, updateStatusSchema } from "@/lib/validations/task";
import type { Task, TaskStatus, Urgency } from "@/types/task";

export type ActionResult = { success: true } | { success: false; error: string };

const TASK_COLUMNS =
  "id,cabCode,cabLink,siteUrl,siteName,description,urgency,deadline,status,assignedTo,createdAt,updatedAt";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Non authentifié");
  }
  return session.user;
}

export async function fetchSiteNameAction(siteUrl: string): Promise<string> {
  try {
    return await extractSiteName(siteUrl);
  } catch {
    return "";
  }
}

export async function getAssignees() {
  const { data, error } = await supabase
    .from("Task")
    .select("assignedTo")
    .not("assignedTo", "is", null)
    .order("assignedTo", { ascending: true });

  if (error) throw new Error(error.message);
  return Array.from(new Set((data ?? []).map((row) => row.assignedTo as string)));
}

export async function getTaskById(id: string): Promise<Task | null> {
  const { data, error } = await supabase.from("Task").select(TASK_COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Task | null;
}

export type TaskFilters = {
  status?: string;
  assignedTo?: string;
};

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  let query = supabase.from("Task").select(TASK_COLUMNS);

  if (filters.status && ["A_FAIRE", "TERMINE"].includes(filters.status)) {
    query = query.eq("status", filters.status);
  }
  if (filters.assignedTo) {
    query = query.eq("assignedTo", filters.assignedTo);
  }

  const { data, error } = await query
    .order("urgency", { ascending: false })
    .order("deadline", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Task[];
}

export async function createTask(input: unknown): Promise<ActionResult> {
  try {
    await requireUser();
    const parsed = taskSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }
    const data = parsed.data;

    const { error } = await supabase.from("Task").insert({
      id: randomUUID(),
      cabCode: data.cabCode || null,
      cabLink: data.cabLink || null,
      siteUrl: data.siteUrl || null,
      siteName: data.siteName || null,
      description: data.description || null,
      urgency: data.urgency as Urgency,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      assignedTo: data.assignedTo || null,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erreur inattendue" };
  }
}

export async function updateTask(id: string, input: unknown): Promise<ActionResult> {
  try {
    await requireUser();
    const existing = await getTaskById(id);
    if (!existing) {
      return { success: false, error: "Tâche introuvable" };
    }

    const parsed = taskSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
    }
    const data = parsed.data;
    const siteName = data.siteUrl !== existing.siteUrl ? data.siteName || null : existing.siteName;

    const { error } = await supabase
      .from("Task")
      .update({
        cabCode: data.cabCode || null,
        cabLink: data.cabLink || null,
        siteUrl: data.siteUrl || null,
        siteName,
        description: data.description || null,
        urgency: data.urgency as Urgency,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        assignedTo: data.assignedTo || null,
      })
      .eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erreur inattendue" };
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  try {
    await requireUser();
    const existing = await getTaskById(id);
    if (!existing) {
      return { success: false, error: "Tâche introuvable" };
    }

    const { error } = await supabase.from("Task").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erreur inattendue" };
  }
}

export async function toggleTaskStatus(id: string, status: string): Promise<ActionResult> {
  try {
    await requireUser();
    const parsed = updateStatusSchema.safeParse({ id, status });
    if (!parsed.success) {
      return { success: false, error: "Statut invalide" };
    }

    const { error } = await supabase
      .from("Task")
      .update({ status: parsed.data.status as TaskStatus })
      .eq("id", parsed.data.id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erreur inattendue" };
  }
}

