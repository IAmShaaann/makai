"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  return <div>{JSON.stringify(data, null, 2)}</div>;
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
    <ErrorState title="Error loading agents" description="Something went wrong, Please try again later"/>
  )
}