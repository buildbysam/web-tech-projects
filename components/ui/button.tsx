"use client";

import { cx } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

const baseStyles = "border hover:opacity-85 py-2 px-3 text-sm font-normal";
const variantStyles = {
  primary: `bg-primary border-primary text-secondary ${baseStyles}`,
  outline: `bg-transparent border-muted-foreground/25 text-foreground hover:bg-muted-foreground/10 hover:text-primary ${baseStyles}`,
  icon: "bg-transparent [&>svg]:size-4.5 p-2.5 [&>svg]:text-foreground hover:[&>svg]:text-primary hover:bg-muted-foreground/10 border-none",
};

type Props = {
  children: ReactNode;
  variant: keyof typeof variantStyles;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, variant, className, title, ...props }: Props) {
  return (
    <button
      title={title ? title : children?.toString()}
      className={cx(
        "transition-all text-center outline-none cursor-pointer rounded-lg disabled:opacity-75 disabled:cursor-not-allowed disabled:translate-y-0!",
        variantStyles[variant],
        className ? className : ""
      )}
      {...props}
    >
      {children}
    </button>
  );
}
