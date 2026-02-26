import { render } from "@testing-library/react";
import React from "react";

import * as router from "../../../test/router";
import type { Props } from "./about";
import About from "./about";

jest.mock("../../icons/icon.svg", () => ({
  __esModule: true,
  default: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props}>icon.svg</svg>
  ),
}));

describe("about", () => {
  function subject(props: Props) {
    return render(<About {...props} />, { wrapper: router.wrapper });
  }

  it("renders", () => {
    expect(subject({}).asFragment()).toMatchSnapshot();
  });
});
