const OPEN_TIME = "09:00";
const CLOSE_TIME = "18:00";

const STEP_MIN = 15;
const MIN_EVENT_MIN = 15;
const DEFAULT_CREATE_MIN = 30;

const PX_PER_MIN = 2; // visual scale
const HEADER_H = 56;
const GUTTER_W = 72;
const TOP_PAD = 12;
const BOTTOM_PAD = 24;

const RESOURCE_MIN_W = 420; // columns expand to fill available width; min width enables x-scroll when needed
const RESOURCE_MIN_W_TW = "min-w-[400px] lg:w-full"; // columns expand to fill available width; min width enables x-scroll when needed
const LANE_GAP = 6;
const WEEK_DAY_MIN_W = 160; // week view: min width of a day column
const WEEK_RESOURCE_W = 160; // week view: width of the resource column on the left

export {
  OPEN_TIME,
  CLOSE_TIME,
  STEP_MIN,
  MIN_EVENT_MIN,
  DEFAULT_CREATE_MIN,
  PX_PER_MIN,
  HEADER_H,
  GUTTER_W,
  TOP_PAD,
  BOTTOM_PAD,
  RESOURCE_MIN_W,
  LANE_GAP,
  RESOURCE_MIN_W_TW,
  WEEK_DAY_MIN_W,
  WEEK_RESOURCE_W,
};
