"use client";
import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
  CommandEmpty,
} from "@/components/ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandSelectProps {
  options: Array<{
    id: string;
    value: string;
    children?: React.ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (query: string) => void;
  value: string;
  isSearchable?: boolean;
  className?: string;
  placeholder?: string;
}

export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  isSearchable,
  className,
  placeholder = "Select an option",
}: CommandSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const selectedOption = options.find((option) => option.value === value);
  const handleOpenChange = (value: boolean) => {
    onSearch?.("");
    setOpen(value);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="button"
        variant={"outline"}
        className={cn(
          "h-9 justify-between px-4 font-normal",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog
        open={open}
        onOpenChange={handleOpenChange}
        shouldFilter={!onSearch}
      >
        <CommandInput placeholder="Search..." onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">
              No options found
            </span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
