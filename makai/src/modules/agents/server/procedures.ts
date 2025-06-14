import { db } from "@/db";
import { agents } from "@/db/schema";

import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { agentsCreateSchema, agentsUpdateSchema } from "../schemas";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedures
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [existingAgent] = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)),
        );
      if (!existingAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return existingAgent;
    }),

  getMany: protectedProcedures
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { search, page, pageSize } = input;

      const data = await db
        .select({
          meetingCount: sql<number>`2`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [totalCount] = await db
        .select({ count: count(agents.id) })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            search ? ilike(agents.name, `%${search}%`) : undefined,
          ),
        );

      const totalPages = Math.ceil(totalCount.count / pageSize);

      return {
        items: data,
        totalCount: totalPages,
        totalPages,
      };
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

  remove: protectedProcedures
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedAgent] = await db
        .delete(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)),
        )
        .returning();
      if (!deletedAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return deletedAgent;
    }),

  update: protectedProcedures
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)),
        )
        .returning();

      if (!updatedAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return updatedAgent;
    }),
});
