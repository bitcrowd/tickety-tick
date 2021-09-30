import { render } from "@testing-library/react";
import React from "react";

import type { Props } from "./navbar";
import Navbar from "./navbar";

describe("navbar", () => {
  function subject(props: Props) {
    return render(<Navbar {...props} />);
  }

  it("renders its children", () => {
    const children = "navbar content";
    const screen = subject({ children });
    expect(screen.container).toHaveTextContent(children);
  });
});
