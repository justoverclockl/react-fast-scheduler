import { PX_PER_MIN, TOP_PAD } from "@components/constants";

type HourLineProps = {
  hourIndex: number;
};

export function HourLine({ hourIndex }: HourLineProps) {
  return (
    <div
      className="rfs-hour-line rfs:border-border/70"
      style={{ top: TOP_PAD + hourIndex * 60 * PX_PER_MIN }}
    />
  );
}
