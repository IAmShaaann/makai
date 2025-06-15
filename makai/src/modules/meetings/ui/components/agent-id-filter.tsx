import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { MAX_PAGE_SIZE } from "@/constants";
import { AgentsGetMany } from "@/modules/agents/types";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const AgentIdFilter = ({}) => {
  const [filters, setFilters] = useMeetingsFilters();
  const [agentsSearch, setAgentsSearch] = useState<string>("");

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentsSearch,
    }),
  );
  return (
    <>
      <CommandSelect
        className="h-9"
        placeholder="agents"
        options={(data?.items ?? []).map((agent: AgentsGetMany[number]) => ({
          id: agent.id,
          value: agent.id,
          children: (
            <div className="flex items-center gap-x-2">
              <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                className="size-4"
              />
              {agent.name}
            </div>
          ),
        }))}
        onSelect={(value) => setFilters({ agentId: value })}
        onSearch={setAgentsSearch}
        value={filters.agentId || ""}
      />
    </>
  );
};
