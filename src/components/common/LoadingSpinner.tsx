import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
}

const SIZE_MAP = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[2.5px]",
  xl: "size-10 border-3",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  label,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2.5 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${SIZE_MAP[size]} rounded-full border-primary/25 border-t-primary animate-spin shrink-0`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-xs font-medium text-muted-foreground select-none">
          {label}
        </span>
      )}
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
};

interface FullScreenLoaderProps {
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="lg" label={message} />
    </div>
  );
};

interface TablePaginationLoaderProps {
  message?: string;
}

export const TablePaginationLoader: React.FC<TablePaginationLoaderProps> = ({
  message = "Loading...",
}) => {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-white/65 backdrop-blur-[1px] transition-all"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-xs border border-border/80">
        <div className="size-3.5 rounded-full border-2 border-primary/25 border-t-primary animate-spin shrink-0" />
        <span className="text-xs font-medium text-muted-foreground select-none">
          {message}
        </span>
      </div>
    </div>
  );
};
