import { format } from "date-fns";
import { MousePointerClick } from "lucide-react";

import type { Resource } from "../data/scenarios";
import type { ChangeEntry } from "../data/useScenario";

type ChangeLogProps = {
  changes: ChangeEntry[];
  resourceById: Map<string, Resource>;
};

const time = (date: Date) => format(date, "HH:mm");
const day = (date: Date) => format(date, "EEE d");

/** Live view of what `onAppointmentChange` received. */
export function ChangeLog({ changes, resourceById }: ChangeLogProps) {
  const name = (id: string) => resourceById.get(id)?.label ?? id;

  return (
    <div className="p-4">
      <p className="font-mono text-xs text-muted-foreground">onAppointmentChange</p>

      {changes.length === 0 ? (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          <MousePointerClick className="size-5 shrink-0 text-accent-ink" />
          <p>
            Drag a card to move it, or pull its bottom edge to resize it. Each change your app
            receives shows up here.
          </p>
        </div>
      ) : (
        <ol
          className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
          aria-live="polite"
        >
          {changes.map(({ key, event }, index) => {
            const movedResource = event.previousResourceId !== event.resourceId;
            const movedDay = day(event.previousStart) !== day(event.start);
            return (
              <li
                key={key}
                className={`rounded-lg border border-border p-3 text-sm ${
                  index === 0 ? "log-enter bg-accent-soft/60" : "opacity-70"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {event.kind}
                  </span>
                  <span className="truncate font-medium">{event.appointment.title}</span>
                </div>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono text-xs tabular-nums">
                  {movedResource ? (
                    <>
                      <dt className="text-muted-foreground">resourceId</dt>
                      <dd className="truncate">
                        {name(event.previousResourceId)} → {name(event.resourceId)}
                      </dd>
                    </>
                  ) : null}
                  {movedDay ? (
                    <>
                      <dt className="text-muted-foreground">day</dt>
                      <dd>
                        {day(event.previousStart)} → {day(event.start)}
                      </dd>
                    </>
                  ) : null}
                  <dt className="text-muted-foreground">start</dt>
                  <dd>
                    {time(event.previousStart)} → {time(event.start)}
                  </dd>
                  <dt className="text-muted-foreground">end</dt>
                  <dd>
                    {time(event.previousEnd)} → {time(event.end)}
                  </dd>
                </dl>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
