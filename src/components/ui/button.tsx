import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // אש — CTA ראשי
        default:
          "bg-gradient-to-r from-[#E69E33] to-[#CA5F21] text-white shadow-md hover:brightness-110 hover:-translate-y-px active:translate-y-0",
        fire:
          "bg-gradient-to-r from-[#E69E33] via-[#CA5F21] to-[#882E1C] text-white shadow-md hover:brightness-110 hover:-translate-y-px active:translate-y-0",
        // יין — כפתור "צור קשר"
        wine:
          "bg-gradient-to-r from-[#A8485A] via-[#9E2E3F] to-[#63101E] text-white shadow-md hover:brightness-110 hover:-translate-y-px active:translate-y-0",
        // זהב — פרמיום / הישגים
        gold:
          "bg-gradient-to-r from-[#ECC84E] via-[#D9A22A] to-[#AD7C1F] text-[#150E09] shadow-md hover:brightness-105 hover:-translate-y-px active:translate-y-0",
        destructive:
          "bg-gradient-to-r from-[#CA5F21] to-[#882E1C] text-white hover:brightness-110",
        outline:
          "border-2 border-[#F3921E] bg-transparent text-foreground hover:bg-[#F3921E]/10 hover:text-[#F3921E]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-[#F3921E] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-11 px-8",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
