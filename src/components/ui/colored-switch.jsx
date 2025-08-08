import React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

const switchVariants = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "data-[state=checked]:bg-blue-600 hover:data-[state=checked]:bg-blue-700",
          "data-[state=unchecked]:bg-gray-300 hover:data-[state=unchecked]:bg-gray-400",
          "focus-visible:ring-blue-500",
        ],
        success: [
          "data-[state=checked]:bg-green-600 hover:data-[state=checked]:bg-green-700",
          "data-[state=unchecked]:bg-gray-300 hover:data-[state=unchecked]:bg-gray-400",
          "focus-visible:ring-green-500",
        ],
        warning: [
          "data-[state=checked]:bg-yellow-500 hover:data-[state=checked]:bg-yellow-600",
          "data-[state=unchecked]:bg-gray-300 hover:data-[state=unchecked]:bg-gray-400",
          "focus-visible:ring-yellow-500",
        ],
        danger: [
          "data-[state=checked]:bg-red-600 hover:data-[state=checked]:bg-red-700",
          "data-[state=unchecked]:bg-gray-300 hover:data-[state=unchecked]:bg-gray-400",
          "focus-visible:ring-red-500",
        ],
        purple: [
          "data-[state=checked]:bg-purple-600 hover:data-[state=checked]:bg-purple-700",
          "data-[state=unchecked]:bg-gray-300 hover:data-[state=unchecked]:bg-gray-400",
          "focus-visible:ring-purple-500",
        ],
      },
      size: {
        sm: "h-4 w-8",
        default: "h-6 w-11",
        lg: "h-8 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const thumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        default:
          "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const ColoredSwitch = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ variant, size }), className)}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={cn(thumbVariants({ size }))} />
    </SwitchPrimitives.Root>
  )
);

ColoredSwitch.displayName = SwitchPrimitives.Root.displayName;

export { ColoredSwitch };
