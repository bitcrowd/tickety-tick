import type { RenderResult } from "@testing-library/react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import browser from "webextension-polyfill";

import { ticket as make } from "../../../test/factories";
import * as router from "../../../test/router";
import type { Props as ErrorDetailsProps } from "./error-details";
import type { Props } from "./tool";
import Tool from "./tool";

jest.mock(
  "./error-details",
  () =>
    function Component({ errors }: ErrorDetailsProps) {
      const info = errors.map((e) => e.message).join("\n");
      return (
        <button type="button" value={info}>
          ErrorDetails
        </button>
      );
    },
);

describe("tool", () => {
  const tickets = ["un", "deux", "trois"].map((title, i) =>
    make({ id: `${i + 1}`, title }),
  );
  const errors = [new Error("ouch")];

  let screen: RenderResult;

  let openOptions: jest.SpyInstance<Promise<void>, []>;
  let close: jest.SpyInstance<void, []>;

  function subject(overrides: Partial<Props>) {
    const defaults: Props = { tickets: [], errors: [] };
    const props = { ...defaults, ...overrides };
    return render(<Tool {...props} />, { wrapper: router.wrapper });
  }

  beforeEach(() => {
    openOptions = jest.spyOn(browser.runtime, "openOptionsPage");
    close = jest.spyOn(window, "close");
  });

  afterEach(() => {
    openOptions.mockReset();
    close.mockRestore();
  });

  describe("always", () => {
    beforeEach(() => {
      screen = subject({ tickets: [], errors: [] });
      openOptions.mockReset().mockResolvedValue();
      close.mockReset();
    });

    it("renders a settings link", async () => {
      const link = screen.getByRole("link", { name: "Settings" });

      fireEvent.click(link);

      await waitFor(() => {
        expect(openOptions).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
      });
    });

    it("renders a help link", () => {
      const link = screen.getByRole("link", { name: "Help" });
      expect(link).toHaveAttribute("href", "/about");
    });
  });

  describe("with an array of tickets", () => {
    beforeEach(() => {
      screen = subject({ tickets, errors });
    });

    it("renders a ticket list", () => {
      const options = screen.getAllByRole("option");
      const titles = tickets.map((t) => t.title);
      expect(options.map((o) => o.textContent)).toEqual(titles);
    });
  });

  describe("with no tickets found and no errors", () => {
    beforeEach(() => {
      screen = subject({ tickets: [], errors: [] });
    });

    it('renders the "no tickets" notification', () => {
      expect(screen.container).toHaveTextContent(/no tickets found/i);
    });
  });

  describe("with no tickets found and errors", () => {
    beforeEach(() => {
      screen = subject({ tickets: [], errors });
    });

    it("renders an error notification", () => {
      const notification = screen.getByRole("button", { name: "ErrorDetails" }); // because of the mock
      const info = errors.map((e) => e.message).join("\n");
      expect(notification).toHaveValue(info);
    });
  });
});
