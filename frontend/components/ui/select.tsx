"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* A styled single-select built on Base UI's Select primitive — a drop-in
   replacement for a native <select> that matches the app's dark UI instead of
   rendering the OS dropdown. Empty string ("") is treated as "no selection" so
   the placeholder shows, mirroring how the native <select> used value="". */

export type SelectOption = { value: string; label: string };

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  id,
  name,
  required,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <SelectPrimitive.Root
      // Base UI uses null for "nothing selected" — map our "" to that.
      value={value === "" ? null : value}
      onValueChange={(v) => onValueChange((v as string | null) ?? "")}
      name={name}
      required={required}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border bg-background px-3 text-sm outline-none transition-colors",
          "hover:border-ring/60 focus-visible:ring-2 focus-visible:ring-ring data-[popup-open]:ring-2 data-[popup-open]:ring-ring",
          "data-[placeholder]:text-muted-foreground",
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {(val) =>
            options.find((o) => o.value === val)?.label ?? placeholder
          }
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon className="ml-2 shrink-0 text-muted-foreground">
          <ChevronDown className="size-4" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          className="isolate z-50 outline-none"
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <SelectPrimitive.Popup
            className={cn(
              "max-h-(--available-height) w-(--anchor-width) min-w-40 origin-(--transform-origin) overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none",
              "duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            )}
          >
            {options.map((o) => (
              <SelectPrimitive.Item
                key={o.value}
                value={o.value}
                className={cn(
                  "relative flex cursor-default items-center rounded-md py-1.5 pr-8 pl-2.5 text-sm outline-none select-none",
                  "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                )}
              >
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center">
                  <Check className="size-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
