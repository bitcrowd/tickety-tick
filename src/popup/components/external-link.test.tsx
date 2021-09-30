import { render } from "@testing-library/react";
import React from "react";

import type { Props } from "./external-link";
import ExternalLink from "./external-link";

describe("external-link", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = {
      children: "link text",
      href: "https://github.com/bitcrowd/tickety-tick",
    };
    const props = { ...defaults, ...overrides };
    return render(<ExternalLink {...props} />);
  }

  it("sets the link href attribute", () => {
    const href = "https://github.com/";
    const screen = subject({ href });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", href);
  });

  it('sets the target to "_blank"', () => {
    const screen = subject({});
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders the link children", () => {
    const screen = subject({ children: "neat" });
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("neat");
  });

  it("passes on any other properties to the rendered link", () => {
    const screen = subject({ className: "fancy-link" });
    const link = screen.getByRole("link");
    expect(link).toHaveClass("fancy-link");
  });
});
