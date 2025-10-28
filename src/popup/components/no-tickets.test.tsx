import { render } from "@testing-library/react";
import React from "react";

import type { Props as ErrorDetailsProps } from "./error-details";
import type { Props } from "./no-tickets";
import NoTickets from "./no-tickets";

jest.mock(
  "./error-details",
  () =>
    function Component({ errors }: ErrorDetailsProps) {
      return <>{errors.map((error) => `- ${error}`).join("\n")}</>;
    },
);

describe("no-tickets", () => {
  function subject(overrides: Partial<Props>) {
    const defaults: Props = { errors: [] };
    const props = { ...defaults, ...overrides };
    return render(<NoTickets {...props} />);
  }

  describe("with no errors", () => {
    it("renders a hint", () => {
      expect(subject({ errors: [] }).asFragment()).toMatchSnapshot();
    });
  });

  describe("with errors", () => {
    it("renders an error report", () => {
      const errors = [new Error("An error to test error reporting")];
      expect(subject({ errors }).asFragment()).toMatchSnapshot();
    });
  });
});
