import * as React from "react";
import type { BaseSchedulerResource, SchedulerId } from "../../types/scheduler";
import type { DefaultRenderResourceHeaderProps } from "./types";

export function defaultRenderResourceHeader<
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId
>({ resource }: DefaultRenderResourceHeaderProps<TResource, TResourceId>) {
  return <strong>{resource.label}</strong>;
}
