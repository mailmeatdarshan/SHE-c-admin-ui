import * as React from "react"
import { RiErrorWarningLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function Alert({
  title,
  description,
  variant = "destructive",
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-xl border text-sm transition-all",
        variant === "destructive"
          ? "bg-destructive/10 text-destructive border-destructive/20"
          : "bg-muted text-foreground border-border",
        className
      )}
      {...props}
    >
      <RiErrorWarningLine className="size-5 shrink-0 mt-0.5" />
      <div className="space-y-0.5 text-left">
        {title && <h5 className="font-semibold leading-tight">{title}</h5>}
        {description && <p className="text-xs opacity-90">{description}</p>}
        {children}
      </div>
    </div>
  )
}

export default Alert
