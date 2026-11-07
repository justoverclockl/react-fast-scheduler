import * as React from "react";

type DemoFrameProps = {
  /** Name of the mock scenario shown in the header strip. */
  label: string;
  /** Short hint on the right of the header strip, e.g. what to try. */
  hint?: React.ReactNode;
  /** Panel shown below the scheduler, so the scheduler keeps the full width. */
  aside?: React.ReactNode;
  /** Max height of the scrollable scheduler area. */
  maxHeight?: number;
  children: React.ReactNode;
};

export function DemoFrame({ label, hint, aside, maxHeight = 620, children }: DemoFrameProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)]">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-2">
        <span className="text-sm font-medium">
          {label}
          <span className="ml-2 text-xs font-normal text-muted-foreground">mock data</span>
        </span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
        <span className="w-full text-xs text-muted-foreground sm:hidden">
          Swipe sideways to see every column.
        </span>
      </div>
      <div>
        <div
          className="overflow-y-auto overscroll-contain p-3 sm:p-4"
          style={{ maxHeight }}
        >
          {children}
        </div>
        {aside ? (
          <aside className="border-t border-border">{aside}</aside>
        ) : null}
      </div>
    </div>
  );
}
