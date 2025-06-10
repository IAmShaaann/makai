import { Suspense } from "react";
import { ErrorBoundary} from "react-error-boundary"

import { getQueryClient, trpc } from "../../../trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  AgentsErrorState,
  AgentsLoadingState,
  AgentsView,
} from "@/app/modules/agents/ui/views/agents-view";



const AgentsPage = async  () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsLoadingState />}>
        <ErrorBoundary fallback={<AgentsErrorState/>}>
          <AgentsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
export default AgentsPage;
