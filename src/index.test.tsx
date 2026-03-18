import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Scheduler } from "./index";

describe("Scheduler", () => {
  it("renders title", () => {
    render(<Scheduler title="My Schedule" />);
    expect(screen.getByText("My Schedule")).toBeInTheDocument();
  });
});

