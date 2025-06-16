"use client";

import { authClient } from "@/lib/auth-client";
import { LoaderIcon } from "lucide-react";
import { CallConnect } from "./call-connect";
import { generateAvatarUri } from "@/lib/avatar";
interface CallProviderProps {
  meetingId: string;
  meetingName: string;
}
export const CallProvider = ({ meetingName, meetingId }: CallProviderProps) => {
  const { data: session, isPending } = authClient.useSession();
  if (!session || isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={session.user.id}
      userName={session.user.name}
      userImage={
        session.user.image ??
        generateAvatarUri({ seed: session.user.name, variant: "initials" })
      }
    />
  );
};
