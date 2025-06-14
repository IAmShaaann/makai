import { z } from "zod";

export const agentsCreateSchema = z.object({
  name: z.string().min(1, { message: "The name is invalid." }),
  instructions: z.string().min(1, { message: "The instructions are invalid." }),
});

export const agentsUpdateSchema = agentsCreateSchema.extend({
  id: z.string().min(1, { message: "The ID is invalid." }),
});
