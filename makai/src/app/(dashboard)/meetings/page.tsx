import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { MeetingsView } from "@/modules/meetings/ui/views/meetings-view";
import { MeetingsListHeader } from "@/modules/meetings/ui/views/components/meetings-list-header";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "@/modules/meetings/params";

interface MeetingsPageProps {
  searchParams: Promise<SearchParams>;
}

const MeetingsPage = async ({ searchParams }: MeetingsPageProps) => {
  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ ...filters }),
  );
  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsLoadingState />}>
          <ErrorBoundary fallback={<MeetingsErrorState />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
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
