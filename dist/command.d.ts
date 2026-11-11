import { Command as CommandPrimitive } from "cmdk";
import { Dialog } from "./dialog.js";
import type * as React from "react";
declare function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>): React.JSX.Element;
declare function CommandDialog({ title, description, children, className, shouldFilter, ...props }: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
    title?: string;
    description?: string;
    className?: string;
    shouldFilter?: boolean;
    children?: React.ReactNode;
}): React.JSX.Element;
declare function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>): React.JSX.Element;
declare function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>): React.JSX.Element;
declare function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>): React.JSX.Element;
declare function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>): React.JSX.Element;
declare function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>): React.JSX.Element;
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, };
