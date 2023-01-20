import client from "../client";
import scan from "./notion";

jest.mock("../client");

describe("notion adapter", () => {
  const id = "5b1d7dd7-9107-4890-b2ec-83175b8eda83";
  const title = "Add notion.so support";
  const slugId = "5b1d7dd791074890b2ec83175b8eda83";
  const slug = `Add-notion-so-support-${slugId}`;
  const ticketUrl = `https://www.notion.so/${slugId}`;

  const response = {
    results: [
      {
        role: "editor",
        value: {
          id,
          type: "page",
          properties: { title: [[title]] },
        },
      },
    ],
  };

  const ticket = { id, title, type: "page", url: ticketUrl };
  const url = (str: string) => new URL(str);
  const api = { post: jest.fn() };

  beforeEach(() => {
    api.post.mockReturnValue({ json: () => response });
    (client as jest.Mock).mockReturnValue(api);
  });

  afterEach(() => {
    api.post.mockReset();
    (client as jest.Mock).mockReset();
  });

  it("returns an empty array when not on a www.notion.so page", async () => {
    const result = await scan(url("https://another-domain.com"));
    expect(api.post).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("uses the notion.so api", async () => {
    await scan(url(`https://www.notion.so/notionuser/${slug}`));
    expect(client).toHaveBeenCalledWith("https://www.notion.so");
    expect(api.post).toHaveBeenCalled();
  });

  it("returns an empty array when the current page is a board view", async () => {
    api.post.mockReturnValueOnce({
      json: () => ({
        results: [
          {
            role: "editor",
            value: { id, type: "collection_view_page" },
          },
        ],
      }),
    });
    const result = await scan(
      url(
        `https://www.notion.so/notionuser/${slugId}?v=77ff97cab6ff4beab7fa6e27f992dd5e`
      )
    );
    expect(api.post).toHaveBeenCalledWith("api/v3/getRecordValues", {
      json: { requests: [{ table: "block", id }] },
    });
    expect(result).toEqual([]);
  });

  it("returns an emtpy array when the page does not exist", async () => {
    api.post.mockReturnValueOnce({
      json: () => ({ results: [{ role: "editor" }] }),
    });
    const result = await scan(url(`https://www.notion.so/notionuser/${slug}`));
    expect(api.post).toHaveBeenCalledWith("api/v3/getRecordValues", {
      json: { requests: [{ table: "block", id }] },
    });
    expect(result).toEqual([]);
  });

  it("returns an empty array if the page id does not match the requested one", async () => {
    const otherId = "7c1e7ee7-9107-4890-b2ec-83175b8edv99";
    const otherSlugId = otherId.replace(/-/g, "");
    const result = await scan(
      url(`https://www.notion.so/notionuser/Some-ticket-${otherSlugId}`)
    );
    expect(api.post).toHaveBeenCalledWith("api/v3/getRecordValues", {
      json: { requests: [{ table: "block", id: otherId }] },
    });
    expect(result).toEqual([]);
  });

  it("extracts tickets from page modals (board view)", async () => {
    const result = await scan(
      url(
        `https://www.notion.so/notionuser/0e8608aa770a4d36a246d7a3c64f51af?v=77ff97cab6ff4beab7fa6e27f992dd5e&p=${slugId}`
      )
    );
    expect(api.post).toHaveBeenCalledWith("api/v3/getRecordValues", {
      json: { requests: [{ table: "block", id }] },
    });
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from the page view", async () => {
    const result = await scan(url(`https://www.notion.so/notionuser/${slug}`));
    expect(api.post).toHaveBeenCalledWith("api/v3/getRecordValues", {
      json: { requests: [{ table: "block", id }] },
    });
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from the page view without organization", async () => {
    const result = await scan(url(`https://www.notion.so/${slug}`));
    expect(api.post).toHaveBeenCalledWith("api/v3/getRecordValues", {
      json: { requests: [{ table: "block", id }] },
    });
    expect(result).toEqual([ticket]);
  });
});
