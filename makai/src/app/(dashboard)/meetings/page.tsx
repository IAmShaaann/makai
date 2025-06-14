import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { MeetingsView } from "@/modules/meetings/ui/view/meetings-view";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const MeetingsPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsLoadingState />}>
        <ErrorBoundary fallback={<MeetingsErrorState />}>
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default MeetingsPage;

export const MeetingsLoadingState = () => {
  return (
    <LoadingState
      title={"Loading Meetings"}
      description="This may take a few seconds"
    />
  );
};

export const MeetingsErrorState = () => {
  return (
    <ErrorState
      title="Error loading Meetings"
      description="Something went wrong, Please try again later"
    />
  );
};
