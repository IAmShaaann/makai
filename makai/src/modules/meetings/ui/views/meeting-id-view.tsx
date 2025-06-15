"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { tr } from "date-fns/locale";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";

interface MeetingIdViewProps {
  meetingId: string;
}
export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] =
    useState<boolean>(false);
  const [RemovedConfirmation, confirmRemove] = useConfirm(
    "Are you sure you want to remove this meeting?",
    "This action cannot be undone. You will lose all data related to this meeting.",
  );

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    }),
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isProcessing = data.status === "processing";
  const isCompleted = data.status === "completed";
  const isCancelled = data.status === "cancelled";
  const isUpcoming = data.status === "upcoming";

  return (
    <>
      <RemovedConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data?.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isCompleted && <div>Completed</div>}
        {isProcessing && <ProcessingState />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancel={() => {}}
            isCancelling={false}
          />
        )}
        {isActive && <ActiveState meetingId={meetingId} />}
      </div>
    </>
  );
};

export const MeetingIdLoadingState = () => {
  return (
    <LoadingState
      title={"Loading meeting"}
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdErrorState = () => {
  return (
    <ErrorState
      title="Error loading meeting"
      description="Something went wrong, Please try again later"
    />
  );
};
