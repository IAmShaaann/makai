import { db } from "@/db";
import { agents } from "@/db/schema";

import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";

import { agentsCreateSchema } from "../schemas";


export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedures
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [exisitingAgent] = await db
        .select({
          meetingCount: sql`count(*)`,
          ...getTableColumns(agents)
        })
        .from(agents)
        .where(eq(agents.id, input.id));
      return exisitingAgent;
    }),

  getMany: protectedProcedures.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),
  create: protectedProcedures
    .input(agentsCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const [agent] = await db
        .insert(agents)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();

      return agent;
    }),
});
