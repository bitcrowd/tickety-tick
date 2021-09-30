import { fireEvent, render } from "@testing-library/react";
import React from "react";

import type { Props } from "./checkbox-input";
import CheckboxInput from "./checkbox-input";

describe("checkbox-input", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = {
      id: "checkbox-input-id",
      name: "checkbox-input-name",
      label: <span>label</span>,
      checked: true,
      disabled: false,
      onChange: jest.fn(),
    };

    const props = { ...defaults, ...overrides };
    return render(<CheckboxInput {...props} />);
  }

  it("renders an input label", () => {
    const label = "Awesome Label";
    const screen = subject({ id: "id-1", label });
    const input = screen.getByRole("checkbox", { name: label });

    expect(input).toBeInTheDocument();
  });

  it("renders an input field", () => {
    const screen = subject({ id: "id-2", name: "name-2", checked: true });
    const input = screen.getByRole("checkbox");

    expect(input).toHaveAttribute("id", "id-2");
    expect(input).toHaveAttribute("name", "name-2");
    expect(input).toBeChecked();
  });

  it("notifies about input changes", () => {
    const onChange = jest.fn();
    const screen = subject({ onChange });
    const input = screen.getByRole("checkbox");

    fireEvent.click(input);

    expect(onChange).toHaveBeenCalled();
  });

  it("disables the input if requested", () => {
    const screen = subject({ disabled: true });
    const input = screen.getByRole("checkbox");

    expect(input).toBeDisabled();
  });
});
