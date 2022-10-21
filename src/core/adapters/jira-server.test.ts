/**
 * @jest-environment node
 */

import { JSDOM } from "jsdom";

import client from "../client";
import scan from "./jira-server";

jest.mock("../client");

const key = "RC-654";

const response = {
  id: "10959",
  fields: {
    issuetype: { name: "Story" },
    summary: "A quick summary of the ticket",
    description: "A long description of the ticket",
  },
  key,
};

const ticket = {
  id: response.key,
  title: response.fields.summary,
  description: response.fields.description,
  type: response.fields.issuetype.name.toLowerCase(),
  url: `https://my-domain.com/browse/${key}`,
};

describe("jira server adapter", () => {
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
    const result = await scan(url("https://my-domain.com"), doc);
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("returns null when no issue is selected", async () => {
    const result = await scan(url("https://my-domain.com"), doc);
    expect(api.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("uses the endpoints for the current host", async () => {
    await scan(url(`https://my-domain.com/browse/${key}`), doc);
    expect(client).toHaveBeenCalledWith(
      "https://my-domain.com/rest/api/latest"
    );
    expect(api.get).toHaveBeenCalled();
  });

  it("extracts tickets from the active sprints tab", async () => {
    const result = await scan(
      url(`https://my-domain.com/?selectedIssue=${key}`),
      doc
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from the issues tab", async () => {
    const result = await scan(
      url(`https://my-domain.com/projects/TT/issues/${key}?filter=something`),
      doc
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets when browsing an issue", async () => {
    const result = await scan(url(`https://my-domain.com/browse/${key}`), doc);
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from new generation software projects", async () => {
    const result = await scan(
      url(
        `https://my-domain.com/jira/software/projects/TT/boards/8?selectedIssue=${key}`
      ),
      doc
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-domain.com/rest/api/latest"
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from new generation software projects from the board-URL", async () => {
    const result = await scan(
      url(
        `https://my-domain.com/jira/software/projects/TT/boards/7/backlog?selectedIssue=${key}`
      ),
      doc
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-domain.com/rest/api/latest"
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from classic software projects from the board-URL", async () => {
    const result = await scan(
      url(
        `https://my-domain.com/jira/software/c/projects/TT/boards/7?selectedIssue=${key}`
      ),
      doc
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-domain.com/rest/api/latest"
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets from classic software projects from the backlog-URL", async () => {
    const result = await scan(
      url(
        `https://my-domain.com/jira/software/c/projects/TT/boards/7/backlog?selectedIssue=${key}`
      ),
      doc
    );
    expect(client).toHaveBeenCalledWith(
      "https://my-domain.com/rest/api/latest"
    );
    expect(api.get).toHaveBeenCalledWith(`issue/${key}`);
    expect(result).toEqual([ticket]);
  });

  it("extracts tickets on self-managed instances (with path prefix)", async () => {
    const results = await Promise.all([
      scan(
        url(
          `https://jira.local/prefix/secure/RapidBoard.jspa?selectedIssue=${key}`
        ),
        doc
      ),
      scan(url(`https://jira.local/prefix/projects/TT/issues/${key}`), doc),
      scan(url(`https://jira.local/prefix/browse/${key}`), doc),
    ]);

    const endpoint = "https://jira.local/prefix/rest/api/latest";
    const expectedTicket = {
      ...ticket,
      url: `https://jira.local/browse/${key}`,
    };

    expect(client).toHaveBeenNthCalledWith(1, endpoint);
    expect(client).toHaveBeenNthCalledWith(2, endpoint);
    expect(client).toHaveBeenNthCalledWith(3, endpoint);

    expect(results).toEqual([
      [expectedTicket],
      [expectedTicket],
      [expectedTicket],
    ]);
  });
});
