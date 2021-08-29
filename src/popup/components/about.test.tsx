import { shallow } from "enzyme";
import React from "react";

import type { Props } from "./about";
import About from "./about";

describe("about", () => {
  function render(props: Props) {
    return shallow(<About {...props} />);
  }

  it("renders", () => {
    expect(render({})).toMatchSnapshot();
  });
});
