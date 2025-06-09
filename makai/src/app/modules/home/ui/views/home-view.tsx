"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HomeView() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session || !session.user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4 p-4 ">
      <p>Logged in user {session.user.name ?? "Unknown"}</p>
      <Button
        variant={"default"}
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("sign-in"),
            },
          })
        }
      >
        Logout
      </Button>
    </div>
  );
}
