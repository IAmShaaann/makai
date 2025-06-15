"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
// import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { AgentsGetOne } from "../../types";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../../../../components/data-pagination";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";

export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters }),
  ) as {
    data: {
      items: AgentsGetOne[];
      totalPages: number;
    };
  };

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Mak.AI Agent"
          description="Create your first agent to join your lifestyle."
        />
      )}
    </div>
  );
};

export const AgentsLoadingState = () => {
  return (
    <LoadingState
      title={"Loading agents"}
      description="This may take a few seconds"
    />
  );
};

export const AgentsErrorState = () => {
  return (
    <ErrorState
      title="Error loading agents"
      description="Something went wrong, Please try again later"
    />
  );
};
