import { ResponsiveDialog } from "../../../../components/responsive-dialog";
import { AgentsGetOne } from "../../types";
import { AgentForm } from "./agent-form";
interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentsGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Modify Agent"
      description="Update the agent's configuration"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} initialValues={initialValues}/>
    </ResponsiveDialog>
  );
};
