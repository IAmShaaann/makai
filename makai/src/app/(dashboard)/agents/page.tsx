import { Suspense } from "react";
import { ErrorBoundary} from "react-error-boundary"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { getQueryClient, trpc } from "../../../trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
  AgentsErrorState,
  AgentsLoadingState,
  AgentsView,
} from "@/modules/agents/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { redirect } from "next/navigation";

const AgentsPage = async  () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentsListHeader/>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoadingState />}>
          <ErrorBoundary fallback={<AgentsErrorState/>}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};
export default AgentsPage;
