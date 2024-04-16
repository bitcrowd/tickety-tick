/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import client from "../client";
import scan from "./jira-cloud";

jest.mock("../client");

const key = "RC-654";

const description = "A long description of the ticket";

const response = {
  id: "10959",
  fields: {
    issuetype: { name: "Story" },
    summary: "A quick summary of the ticket",
    description: {
      version: 1,
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: description }],
        },
      ],
    },
  },
  key,
};

const ticket = {
  id: response.key,
  title: response.fields.summary,
  description: `${description}\n`,
  type: response.fields.issuetype.name.toLowerCase(),
  url: `https://my-subdomain.atlassian.net/browse/${key}`,
};

describe("jira cloud adapter", () => {
  const dom = new JSDOM('<html><body id="jira">…</body"</html>');
  const url = (str: string) => new URL(str);
  const doc = dom.window.document;

  const api = { get: jest.fn() };

  beforeEach(() => {
    api.get.mockReturnValue({ json: () => response });
    (client as jest.Mock).mockReturnValue(api);
  });

  afterEach(() => {
    (client as jest.Mock).mockReset();
    api.get.mockReset();
  });

  it("returns an empty array when on a different host", async () => {
    const result = await scan(url("https://another-domain.com"));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("returns null when no issue is selected", async () => {
    const result = await scan(url("https://my-subdomain.atlassian.com"));
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("uses the endpoints for the current host", async () => {
    await scan(url(`https://my-subdomain.atlassian.net/browse/${key}`));
    expect(client).toHaveBeenCalledWith(
      "https://my-subdomain.atlassian.net/rest/api/3",
    );
    expect(api.get).toHaveBeenCalled();
  });

  it("extracts tickets from the active sprints tab", async () => {
    const result = await scan(
      url(`https://my-subdomain.atlassian.net/?selectedIssue=${key}`),
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from the issues tab", async () => {
    const result = await scan(
      url(
        `https://my-subdomain.atlassian.net/projects/TT/issues/${key}?filter=something`,
      ),
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets when browsing an issue", async () => {
    const result = await scan(
      url(`https://my-subdomain.atlassian.net/browse/${key}`),
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from new generation software projects", async () => {
    const result = await scan(
      url(
        `https://my-subdomain.atlassian.net/jira/software/projects/TT/boards/8?selectedIssue=${key}`,
      ),
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-subdomain.atlassian.net/rest/api/3",
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from new generation software projects from the board-URL", async () => {
    const result = await scan(
      url(
        `https://my-subdomain.atlassian.net/jira/software/projects/TT/boards/7/backlog?selectedIssue=${key}`,
      ),
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-subdomain.atlassian.net/rest/api/3",
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from classic software projects from the board-URL", async () => {
    const result = await scan(
      url(
        `https://my-subdomain.atlassian.net/jira/software/c/projects/TT/boards/7?selectedIssue=${key}`,
      ),
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-subdomain.atlassian.net/rest/api/3",
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from classic software projects from the backlog-URL", async () => {
    const result = await scan(
      url(
        `https://my-subdomain.atlassian.net/jira/software/c/projects/TT/boards/7/backlog?selectedIssue=${key}`,
      ),
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-subdomain.atlassian.net/rest/api/3",
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });
});
