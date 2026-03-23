import type { BaseSchedulerResource, SchedulerId } from "../../types/scheduler";

export type DefaultRenderResourceHeaderProps<TResource extends BaseSchedulerResource<TResourceId>, TResourceId extends SchedulerId> = {
  resource: TResource;
};
