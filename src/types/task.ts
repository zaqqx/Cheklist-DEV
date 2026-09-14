export type Urgency = "BASSE" | "MOYENNE" | "HAUTE" | "CRITIQUE";
export type TaskStatus = "A_FAIRE" | "TERMINE";

export type Task = {
  id: string;
  cabCode: string | null;
  cabLink: string | null;
  siteUrl: string | null;
  siteName: string | null;
  description: string | null;
  urgency: Urgency;
  deadline: string | null;
  status: TaskStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskWithRelations = Task;
