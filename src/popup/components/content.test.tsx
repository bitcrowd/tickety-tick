import { render } from "@testing-library/react";
import React from "react";

import type { Props } from "./content";
import Content from "./content";

describe("Content", () => {
  function subject(props: Props) {
    return render(<Content {...props} />);
  }

  it("renders its children", () => {
    const children = "nested content";
    const screen = subject({ children });
    expect(screen.container).toHaveTextContent(children);
  });
});
