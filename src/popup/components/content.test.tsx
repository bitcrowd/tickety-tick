import { shallow } from "enzyme";
import React from "react";

import type { Props } from "./content";
import Content from "./content";

describe("Content", () => {
  function render(props: Props) {
    return shallow(<Content {...props} />);
  }

  it("renders its children", () => {
    const children = "nested content";
    const wrapper = render({ children });
    expect(wrapper.contains(children)).toBe(true);
  });
});
