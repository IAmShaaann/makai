import {
  AgentIdErrorState,
  AgentIdLoadingState,
  AgentIdView,
} from "@/modules/agents/ui/views/agents-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface AgentIdPageProps {
  params: Promise<{ agentId: string }>;
}

const AgentIdPage = async ({ params }: AgentIdPageProps) => {
  const { agentId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({
      id: agentId,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentIdLoadingState />}>
        <ErrorBoundary fallback={<AgentIdErrorState />}>
          <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
export default AgentIdPage;
