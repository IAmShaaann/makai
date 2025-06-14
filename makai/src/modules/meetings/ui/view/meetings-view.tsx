"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div>
      <h1>Meetings View</h1>
    </div>
  );
};
