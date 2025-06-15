import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  meetingsUpdateSchema,
  meetingsCreateSchema,
} from "@/modules/meetings/schemas";
import { MeetingsGetOne } from "@/modules/meetings/types";
import { MAX_PAGE_SIZE } from "@/constants";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useState } from "react";
import { CreateAgentDialog } from "@/modules/agents/ui/components/create-agent-dialog";
import { AgentsGetMany } from "@/modules/agents/types";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingsGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [agentSearch, setAgentSearch] = useState<string>("");
  const [openCreateAgentDialog, setOpenCreateAgentDialog] =
    useState<boolean>(false);

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentSearch,
    }),
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof meetingsCreateSchema>>({
    resolver: zodResolver(meetingsCreateSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsCreateSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({
        ...values,
        id: initialValues?.id,
      });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <>
      <CreateAgentDialog
        open={openCreateAgentDialog}
        onOpenChange={setOpenCreateAgentDialog}
      />
      <Form {...form}>
        <form className="space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="How to steal Ramen from Ichiraku?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(data?.items ?? []).map(
                      (agent: AgentsGetMany[number]) => ({
                        label: agent.name,
                        value: agent.id,
                        children: (
                          <div className="flex  items-center gap-x-2">
                            <GeneratedAvatar
                              seed={agent.name}
                              variant="botttsNeutral"
                              className="border size-6"
                            />
                            <span className="text-sm">{agent.name}</span>
                          </div>
                        ),
                      }),
                    )}
                    value={field.value}
                    onSelect={(value) => form.setValue("agentId", value)}
                    onSearch={setAgentSearch}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found the agent you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenCreateAgentDialog(true)}
                  >
                    Create a new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex  justify-between items-center">
            {onCancel && (
              <Button
                variant={"ghost"}
                disabled={isPending}
                type="button"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={isPending}
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
