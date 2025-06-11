import { ResponsiveDialog } from "../../../../components/responsive-dialog";
import { AgentForm } from "./agent-form";
interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAgentDialog = ({
  open,
  onOpenChange,
}: CreateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Configure Agent"
      description="Create a new agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)}/>
    </ResponsiveDialog>
  );
};
