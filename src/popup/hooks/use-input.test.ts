import type React from "react";
import { useState } from "react";

import useInput from "./use-input";

jest.mock("react");

describe("use-input", () => {
  beforeEach(() => {
    (useState as jest.Mock).mockReset();
  });

  it("receives an initial value and tracks updates", () => {
    const setValue = jest.fn();
    (useState as jest.Mock).mockImplementation((value) => [value, setValue]);

    const { value, onChange } = useInput("initial");

    expect(value).toBe("initial");

    const event = {
      target: { value: "updated" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);

    expect(setValue).toHaveBeenCalledWith("updated");
  });
});
