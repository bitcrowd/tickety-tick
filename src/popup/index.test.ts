/**
 * @jest-environment jsdom
 */
import ".";

import browser from "webextension-polyfill";

import { ticket as make } from "../../test/factories";
import enhance from "../core/enhance";
import { deserialize } from "../errors";
import store from "../store";
import render from "./render";
import type { BackgroundWorker } from "./types";

const mockBackgroundWorker: BackgroundWorker = { getTickets: jest.fn() };

jest
  .mock("webextension-polyfill", () => {
    const runtime = {
      sendMessage: jest
        .fn()
        .mockImplementation((_msg, _sender) =>
          mockBackgroundWorker.getTickets(),
        ),
    };
    return { runtime };
  })
  .mock("../core/enhance", () => jest.fn(() => jest.fn()))
  .mock("../store", () => ({ get: jest.fn().mockResolvedValue({}) }))
  .mock("./observe-media")
  .mock("./render");

describe("popup", () => {
  const initialize = window.onload as () => Promise<void>;

  beforeEach(() => {
    (mockBackgroundWorker.getTickets as jest.Mock).mockResolvedValue({
      tickets: [],
      errors: [],
    });
    (store.get as jest.Mock).mockResolvedValue({});
    (enhance as jest.Mock).mockReturnValue((x: any) => x); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  afterEach(() => {
    (mockBackgroundWorker.getTickets as jest.Mock).mockReset();
    (store.get as jest.Mock).mockReset();
    (enhance as jest.Mock).mockReset();
    (render as jest.Mock).mockReset();
  });

  it("sets up an initialization handler", () => {
    expect(initialize).toEqual(expect.any(Function));
  });

  it("fetches ticket information through the background page", async () => {
    await initialize();

    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
      getTickets: true,
    });
    expect(mockBackgroundWorker.getTickets).toHaveBeenCalled();
  });

  it("loads settings from storage", async () => {
    await initialize();

    expect(store.get).toHaveBeenCalledWith(null);
  });

  it("configures ticket formatting", async () => {
    const templates = { branch: "test/branch" };
    const options = { autofmt: Math.random() < 0.5 };
    (store.get as jest.Mock).mockResolvedValue({ templates, options });

    await initialize();

    expect(enhance).toHaveBeenCalledWith(templates, options.autofmt);
  });

  it("renders the popup content with enhanced tickets", async () => {
    const tickets = ["uno", "dos"].map((title, id) =>
      make({ id: id.toString(), title }),
    );
    (mockBackgroundWorker.getTickets as jest.Mock).mockResolvedValue({
      tickets,
      errors: [],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const format = (ticket: any) => ({ ...ticket, fmt: true });
    const enhancer = jest.fn(format);
    (enhance as jest.Mock).mockReturnValue(enhancer);

    await initialize();

    expect(enhance).toHaveBeenCalled();

    expect(render).toHaveBeenCalledWith(
      tickets.map(format),
      expect.any(Object),
    );
  });

  it("renders the popup content with errors", async () => {
    const errors = [{ message: "Test Error" }];
    (mockBackgroundWorker.getTickets as jest.Mock).mockResolvedValue({
      tickets: [],
      errors,
    });

    await initialize();

    expect(render).toHaveBeenCalledWith(
      expect.any(Object),
      errors.map(deserialize),
    );
  });
});
