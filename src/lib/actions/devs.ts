"use server";

import { randomUUID } from "node:crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Non authentifié");
  }
  return session.user;
}

export async function getDevs(): Promise<string[]> {
  const { data, error } = await supabase.from("Dev").select("name").order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.name as string);
}

export async function createDev(name: string): Promise<ActionResult<string>> {
  try {
    await requireUser();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 100) {
      return { success: false, error: "Nom invalide" };
    }

    const { error } = await supabase.from("Dev").insert({ id: randomUUID(), name: trimmed });
    if (error) {
      if (error.code === "23505") {
        return { success: true, data: trimmed };
      }
      throw new Error(error.message);
    }

    return { success: true, data: trimmed };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erreur inattendue" };
  }
}
