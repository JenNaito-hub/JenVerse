import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  HistoryItem,
  Project,
  KnowledgeConversation,
  GenerationType,
} from "@/types";

import { historyItems as mockHistory } from "@/data/history";
import { projects as mockProjects } from "@/data/projects";
import { knowledgeConversations as mockConversations } from "@/data/knowledge";
import { teamMembers } from "@/data/team";

/**
 * Data-access layer. Every reader queries Supabase when it's configured and
 * the user is authenticated; otherwise it returns the mock dataset. This keeps
 * the entire app functional with an empty `.env.local`.
 */

export async function getHistoryItems(): Promise<HistoryItem[]> {
  const supabase = createClient();
  if (!supabase) return mockHistory;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return mockHistory;

    const { data, error } = await supabase
      .from("history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !data?.length) return mockHistory;

    return data.map((row) => ({
      id: row.id,
      type: row.type as GenerationType,
      title: row.title,
      prompt: row.prompt,
      model: row.model,
      project: row.project ?? undefined,
      createdAt: row.created_at,
      tokens: row.tokens ?? undefined,
      thumbnail: row.thumbnail ?? undefined,
    }));
  } catch {
    return mockHistory;
  }
}

export async function addHistoryItem(
  item: Omit<HistoryItem, "id" | "createdAt">
): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("history").insert({
      user_id: user.id,
      type: item.type,
      title: item.title,
      prompt: item.prompt,
      model: item.model,
      project: item.project ?? null,
      tokens: item.tokens ?? null,
      thumbnail: item.thumbnail ?? null,
    });
  } catch {
    // Best-effort persistence — never block the response.
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  if (!supabase) return mockProjects;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return mockProjects;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error || !data?.length) return mockProjects;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      status: row.status,
      color: row.color ?? "#D7F205",
      assets: row.assets ?? 0,
      members: teamMembers.slice(0, 3),
      updatedAt: row.updated_at,
      progress: row.progress ?? 0,
    }));
  } catch {
    return mockProjects;
  }
}

export async function getKnowledgeConversations(): Promise<
  KnowledgeConversation[]
> {
  // Conversations are persisted client-side in V2; reads fall back to mock.
  return mockConversations;
}
