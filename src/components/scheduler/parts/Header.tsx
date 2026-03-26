
import { GUTTER_W, RESOURCE_MIN_W } from "@components/constants";
import { defaultRenderResourceHeader } from "@components/defaultRenderResourceHeader";
import { fullName, isNameLike } from "@utils/scheduler-core.utils";
import * as React from "react";

import type { BaseSchedulerResource, SchedulerId } from "@rfs-types/scheduler";

type SchedulerHeaderProps<
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  resources: TResource[];
  renderResourceHeader?: (resource: TResource) => React.ReactNode;
};

export function Header<
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({ resources, renderResourceHeader }: SchedulerHeaderProps<TResource, TResourceId>) {
  return (
    <div className="rfs-header rfs:border-border rfs:bg-card">
      <div
        className="rfs-gutter rfs:border-border"
        style={{ width: GUTTER_W }}
      />
      {resources.map((resource) => (
        <div
          key={String(resource.id)}
          className="rfs-resource-header rfs:border-border rfs:bg-card rfs:text-foreground"
          style={{ minWidth: RESOURCE_MIN_W, flex: 1 }}
        >
          {(renderResourceHeader ?? ((r) => defaultRenderResourceHeader({ resource: r })))(
            resource
          )}
          {isNameLike(resource) ? (
            <div className="rfs-resource-subtitle rfs:text-muted-foreground">
              {fullName(resource)}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
