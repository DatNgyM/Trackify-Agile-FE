import * as React from "react";

const buttonVariants = {
  variant: {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring",
    outline:
      "border border-border bg-background hover:bg-muted hover:text-foreground focus-visible:ring-ring",
    ghost: "hover:bg-muted hover:text-foreground focus-visible:ring-ring",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
    link: "text-primary underline-offset-4 hover:underline focus-visible:ring-ring",
  },
  size: {
    sm: "h-8 px-3 text-xs rounded-sm",
    md: "h-9 px-4 text-sm rounded-md",
    lg: "h-10 px-6 text-base rounded-lg",
    icon: "h-9 w-9 rounded-md",
  },
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isIconSize = size === "icon";
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center whitespace-nowrap font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${buttonVariants.variant[variant]}
          ${buttonVariants.size[size]}
          ${!isIconSize ? "gap-2" : ""}
          ${className}
        `.replace(/\s+/g, " ")}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
