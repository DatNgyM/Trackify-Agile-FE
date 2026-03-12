import * as React from "react";

const cardVariants = {
  default:
    "bg-background border border-border text-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden",
  muted:
    "bg-muted/60 border border-border text-foreground shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden",
} as const;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof cardVariants;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={`${cardVariants[variant]} ${className}`.replace(/\s+/g, " ")}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-5 pb-2 ${className}`.replace(/\s+/g, " ")}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref as React.Ref<HTMLHeadingElement>}
    className={`text-lg font-semibold leading-tight tracking-tight text-foreground ${className}`.replace(/\s+/g, " ")}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-5 pt-0 text-sm text-foreground/90 leading-relaxed ${className}`.replace(/\s+/g, " ")} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-5 pt-3 border-t border-border ${className}`.replace(/\s+/g, " ")}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, cardVariants };
