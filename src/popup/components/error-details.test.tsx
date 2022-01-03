import { render } from "@testing-library/react";
import React from "react";

import type { Props as CopyButtonProps } from "./copy-button";
import type { Props } from "./error-details";
import CopyErrorDetails from "./error-details";

jest.mock("./copy-button", () => ({ value }: CopyButtonProps) => (
  <button type="button" value={value}>
    Copy error details
  </button>
));

describe("error-details", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = { errors: [new Error("WAT?")] };
    const props = { ...defaults, ...overrides };
    return render(<CopyErrorDetails {...props} />);
  }

  it("renders a button to copy the error details", () => {
    const error = new Error("Boom!");
    error.name = "TestError";
    error.stack = "@test it code:21:3\n@test anonymous code:22:19\n";

    const screen = subject({ errors: [error] });

    const button = screen.getByRole("button", {
      name: "Copy error details",
    }) as HTMLButtonElement;

    expect(button.value).toMatchSnapshot();
  });
});
