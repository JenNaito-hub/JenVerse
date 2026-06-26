import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export type ProjectStatus = "active" | "draft" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  assets: number;
  members: TeamMember[];
  updatedAt: string;
  progress: number;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export type GenerationType = "knowledge" | "image";

export interface HistoryItem {
  id: string;
  type: GenerationType;
  title: string;
  prompt: string;
  model: string;
  project?: string;
  createdAt: string;
  tokens?: number;
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface KnowledgeConversation {
  id: string;
  title: string;
  preview: string;
  model: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  model: string;
  aspectRatio: string;
  createdAt: string;
  liked: boolean;
}

export interface StatCard {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: LucideIcon;
}

export interface ActivityItem {
  id: string;
  actor: TeamMember;
  action: string;
  target: string;
  type: GenerationType | "project" | "system";
  createdAt: string;
}

export interface UsagePoint {
  label: string;
  knowledge: number;
  image: number;
}

export type TemplateCategory =
  | "Marketing"
  | "Content"
  | "Social"
  | "Design"
  | "Research"
  | "Support"
  | "Product";

export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  type: GenerationType;
  prompt: string;
  color: string;
  uses: number;
  featured?: boolean;
}

export type WorkflowCategory =
  | "Generation"
  | "Editing"
  | "Consistency"
  | "Commercial";

export type WorkflowStepType =
  | "input"
  | "model"
  | "processor"
  | "control"
  | "output";

export interface WorkflowStep {
  id: string;
  type: WorkflowStepType;
  label: string;
  config?: Record<string, string | number | boolean>;
}

export interface WorkflowVersion {
  version: string;
  createdAt: string;
  note: string;
  steps: WorkflowStep[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  color: string;
  tags: string[];
  currentVersion: string;
  versions: WorkflowVersion[];
  runs: number;
  updatedAt: string;
  favorite?: boolean;
}

export type LeadSource = "facebook_post" | "facebook_group" | "tiktok_video";

export type LeadTemperature = "hot" | "warm" | "cold";

export interface Lead {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  keywords: string[];
  temperature: LeadTemperature;
  source: LeadSource;
  commentedAt: string;
}
