import type { TeamMember } from "@/types";

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/glass/svg?seed=${seed}`;

export const currentUser: TeamMember = {
  id: "u-jen",
  name: "Jen Aescentic",
  avatar: avatar("Jen"),
  role: "Owner",
};

export const teamMembers: TeamMember[] = [
  currentUser,
  { id: "u-mara", name: "Mara Lindqvist", avatar: avatar("Mara"), role: "Designer" },
  { id: "u-theo", name: "Theo Okafor", avatar: avatar("Theo"), role: "Engineer" },
  { id: "u-rin", name: "Rin Takahashi", avatar: avatar("Rin"), role: "Researcher" },
  { id: "u-cole", name: "Cole Whitman", avatar: avatar("Cole"), role: "Marketing" },
];
