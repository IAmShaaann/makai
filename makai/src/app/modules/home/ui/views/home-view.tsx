"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
export default function HomeView() {
  const trpc = useTRPC();
  const {data} = useQuery(trpc.hello.queryOptions({"text" :"Prashant"}))
  return (
    <div className="flex flex-col gap-y-4 p-4 ">
      {data?.greeting}
    </div>
  );
}
