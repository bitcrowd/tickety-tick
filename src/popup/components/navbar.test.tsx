import { shallow } from "enzyme";
import React from "react";

import type { Props } from "./navbar";
import Navbar from "./navbar";

describe("navbar", () => {
  function render(props: Props) {
    return shallow(<Navbar {...props} />);
  }

  it("renders its children", () => {
    const children = "navbar content";
    const wrapper = render({ children });
    expect(wrapper.contains(children)).toBe(true);
  });
});
