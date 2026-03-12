import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";

export { Label };
