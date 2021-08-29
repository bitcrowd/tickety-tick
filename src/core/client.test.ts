import ky from "ky";

import client from "./client";

jest.mock("ky");

describe("client", () => {
  const mock = { ky: true };

  beforeEach(() => {
    (ky.extend as jest.Mock).mockReturnValue(mock);
  });

  afterEach(() => {
    (ky.extend as jest.Mock).mockReset();
  });

  it("creates a new client with default values", () => {
    const instance = client("https://example.io/api");
    expect((ky.extend as jest.Mock).mock.calls).toMatchSnapshot();
    expect(instance).toBe(mock);
  });

  it("sets custom options", () => {
    const instance = client("https://example.io/api", {
      credentials: "same-origin",
      timeout: 3000,
    });
    expect((ky.extend as jest.Mock).mock.calls).toMatchSnapshot();
    expect(instance).toBe(mock);
  });
});
