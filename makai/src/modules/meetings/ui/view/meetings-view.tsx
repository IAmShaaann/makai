"use client";

import { DataTable } from "@/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MeetingsGetMany } from "../../types";
import { columns } from "./components/columns";
import { EmptyState } from "@/components/empty-state";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({})) as {
    data: {
      items: MeetingsGetMany[];
    };
  };

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable columns={columns} data={data.items} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Start by scheduling a meeting with your agent."
        />
      )}
    </div>
  );
};
