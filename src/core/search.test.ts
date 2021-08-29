import { search } from "./search";
import type { Adapter, TicketData } from "./types";
import serializable from "./utils/serializable-errors";

jest.mock("./utils/serializable-errors", () => (error: Error) => error.message);

describe("ticket search", () => {
  function mock(result: Promise<TicketData[]>, index: number): Adapter {
    return jest.fn().mockName(`adapters[${index}]`).mockReturnValue(result);
  }

  function mocks(results: Promise<TicketData[]>[]) {
    return results.map(mock);
  }

  const url = new URL("https://x.yz");
  const doc = {} as Document;

  it("feeds the location and document to every adapter", async () => {
    const adapters = mocks([[], []].map((v) => Promise.resolve(v)));

    await search(adapters, url, doc);

    adapters.forEach((scan) => {
      expect(scan).toHaveBeenCalledWith(url, doc);
    });
  });

  it("resolves with the aggregated tickets and serializable errors", async () => {
    const tickets0 = [{ id: "0", title: "true story", type: "test" }];
    const tickets1 = [{ id: "1", title: "yep", type: "test" }];

    const error0 = new Error("test error 0");
    const error1 = new Error("test error 1");

    const adapters = mocks([
      Promise.resolve(tickets0),
      Promise.resolve(tickets1),
      Promise.reject(error0),
      Promise.reject(error1),
    ]);

    const results = await search(adapters, url, doc);

    expect(results).toEqual({
      tickets: [...tickets0, ...tickets1],
      errors: [error0, error1].map(serializable),
    });
  });
});
