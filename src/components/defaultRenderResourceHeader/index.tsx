import * as React from "react";

import type { DefaultRenderResourceHeaderProps } from "./types";
import type { BaseSchedulerResource, SchedulerId } from "../../types/scheduler";

export function defaultRenderResourceHeader<
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
>({ resource }: DefaultRenderResourceHeaderProps<TResource, TResourceId>) {
  return <strong>{resource.label}</strong>;
}
