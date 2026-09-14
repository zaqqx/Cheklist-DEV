export type Urgency = "BASSE" | "MOYENNE" | "HAUTE" | "CRITIQUE";
export type TaskStatus = "A_FAIRE" | "EN_COURS" | "TERMINE";

export type Task = {
  id: string;
  cabCode: string | null;
  cabLink: string | null;
  siteUrl: string;
  siteName: string | null;
  urgency: Urgency;
  deadline: string | null;
  status: TaskStatus;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskWithRelations = Task;
