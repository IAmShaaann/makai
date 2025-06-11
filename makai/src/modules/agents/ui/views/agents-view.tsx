"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";


export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
    <DataTable columns={columns} data={data} />
    {data.length === 0 && (
      <EmptyState title="Create your first MakaI Agent" description="Create your first agent to join your lifestyle." />
    )}
  </div>
};

export const AgentsLoadingState = () => {
  return (
    <LoadingState
      title={"Loading agents"}
      description="This may take a few seconds"
    />
  );
};

export const AgentsErrorState = () => {
  return (
    <ErrorState
      title="Error loading agents"
      description="Something went wrong, Please try again later"
    />
  );
};
