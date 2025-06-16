"use client";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CallProvider } from "../components/call-provider";

interface CallViewProps {
  meetingId: string;
}

export const CallView = ({ meetingId }: CallViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    }),
  );

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="This meeting has ended."
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <CallProvider meetingId={meetingId} meetingName={data.name} />
    </div>
  );
};
