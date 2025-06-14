import { z } from "zod";

export const meetingsCreateSchema = z.object({
  name: z.string().min(1, { message: "The name is invalid." }),
  agentId: z.string().min(1, { message: "The agent is required." }),
});

export const meetingsUpdateSchema = meetingsCreateSchema.extend({
  id: z.string().min(1, { message: "The ID is invalid." }),
});
