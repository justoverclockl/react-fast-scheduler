import { PX_PER_MIN, STEP_MIN, TOP_PAD } from "@components/constants";

type SlotLineProps = {
  slotIndex: number;
};

export function SlotLine({ slotIndex }: SlotLineProps) {
  return (
    <div
      className="rfs-slot-line rfs:border-border/50"
      style={{ top: TOP_PAD + slotIndex * STEP_MIN * PX_PER_MIN }}
    />
  );
}
