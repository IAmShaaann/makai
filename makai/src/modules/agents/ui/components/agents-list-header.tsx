"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

import { AgentsSearchFilter } from "./agents-search-filter";
import { CreateAgentDialog } from "./create-agent-dialog";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const areFiltersModified = !!filters.search;
  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <CreateAgentDialog
        open={isDialogOpen}
        onOpenChange={() => setIsDialogOpen((open) => !open)}
      />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Available Agents</h5>
          <Button onClick={() => setIsDialogOpen((open) => !open)}>
            <PlusIcon /> Create Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter />
          {areFiltersModified && (
            <Button variant={"outline"} size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
