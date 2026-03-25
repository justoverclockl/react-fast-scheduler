import type { BaseSchedulerResource, SchedulerId } from "@rfs-types/scheduler";

export type DefaultRenderResourceHeaderProps<
  TResource extends BaseSchedulerResource<TResourceId>,
  TResourceId extends SchedulerId,
> = {
  resource: TResource;
};
