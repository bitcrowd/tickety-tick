/**
 * @jest-environment jsdom
 */
import type { ShallowWrapper } from "enzyme";
import { shallow } from "enzyme";
import React from "react";
import { Link } from "react-router-dom";
import browser from "webextension-polyfill";

import { ticket as make } from "../../../test/factories";
import NoTickets from "./no-tickets";
import TicketControls from "./ticket-controls";
import type { Props } from "./tool";
import Tool from "./tool";

const promises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("tool", () => {
  const tickets = ["un", "deux", "trois"].map((title, i) =>
    make({ id: `${i + 1}`, title })
  );
  const errors = [new Error("ouch")];

  let wrapper: ShallowWrapper<Props>;

  let openOptions: jest.SpyInstance<Promise<void>, []>;
  let close: jest.SpyInstance<void, []>;

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
      wrapper = shallow(<Tool tickets={[]} errors={[]} />);
      openOptions.mockReset().mockResolvedValue();
      close.mockReset();
    });

    it("renders a settings link", async () => {
      const link = wrapper.find("a").filter({ children: "Settings" });
      expect(link.exists()).toBe(true);

      const preventDefault = jest.fn();
      link.simulate("click", { preventDefault });

      expect(preventDefault).toHaveBeenCalled();
      expect(openOptions).toHaveBeenCalled();

      await promises(); // wait for promise to settle

      expect(close).toHaveBeenCalled();
    });

    it("renders a help link", () => {
      const link = wrapper.find(Link).filter({ children: "Help" });
      expect(link.prop("to")).toBe("/about");
    });
  });

  describe("with an array of tickets", () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={tickets} errors={errors} />);
    });

    it("renders a ticket list", () => {
      expect(wrapper.find(TicketControls).prop("tickets")).toBe(tickets);
    });
  });

  describe("with no tickets found and no errors", () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={[]} errors={[]} />);
    });

    it('renders the "no tickets" notification', () => {
      const notification = wrapper.find(NoTickets);
      expect(notification.exists()).toBe(true);
    });
  });

  describe("with no tickets found and errors", () => {
    beforeEach(() => {
      wrapper = shallow(<Tool tickets={[]} errors={errors} />);
    });

    it('renders the "no tickets" notification', () => {
      const notification = wrapper.find(NoTickets);
      expect(notification.exists()).toBe(true);
      expect(notification.prop("errors")).toBe(errors);
    });
  });
});
