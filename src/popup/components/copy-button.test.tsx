import { fireEvent, render } from "@testing-library/react";
import pbcopy from "copy-text-to-clipboard";
import React from "react";

import type { Props } from "./copy-button";
import CopyButton from "./copy-button";

jest.mock("copy-text-to-clipboard");
jest.useFakeTimers();

describe("copy-button", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = { value: "copy text" };
    const props = { ...defaults, ...overrides };
    return render(<CopyButton {...props} />);
  }

  let close: jest.SpyInstance<void>;

  beforeEach(() => {
    close = jest.spyOn(window, "close").mockReturnValue();
  });

  afterEach(() => {
    jest.clearAllTimers();
    close.mockRestore();
  });

  it("renders its children", () => {
    const children = "button content";
    const screen = subject({ children });
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(children);
  });

  it('passes the "copied" state to its children if passed a function', () => {
    const children = jest.fn();
    const screen = subject({ children });
    const button = screen.getByRole("button");

    expect(children).toHaveBeenNthCalledWith(1, false);

    fireEvent.click(button);

    expect(children).toHaveBeenNthCalledWith(2, true);
  });

  it("calls the context pbcopy function with the provided value on click", () => {
    const value = "a lot of value for such a small button";
    const screen = subject({ value });
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(pbcopy).toHaveBeenCalledWith(value);
  });

  it("calls the context close function delayed after the value was copied", () => {
    const value = "a lot of value for such a small button";
    const screen = subject({ value });
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(pbcopy).toHaveBeenCalledWith(value);
    expect(close).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(close).toHaveBeenCalled();
  });

  it("passes on any other properties to the rendered button", () => {
    const screen = subject({ value: "0x2a", className: "fancy-button" });
    const button = screen.getByRole("button");

    expect(button).toHaveClass("fancy-button");
  });
});
