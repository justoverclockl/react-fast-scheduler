import * as React from "react";

export type SchedulerProps = {
  title: string;
  className?: string;
};

export function Scheduler({ title, className }: SchedulerProps) {
  return (
    <section className={className} data-testid="scheduler">
      <h2>{title}</h2>
    </section>
  );
}

export function useScheduler(initialTitle = "Scheduler") {
  const [title, setTitle] = React.useState(initialTitle);
  return { title, setTitle };
}

