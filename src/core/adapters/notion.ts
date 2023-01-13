/**
 * notion.so adapter
 *
 * The adapter extracts the UUID of a selected notion.so task ("page") from the
 * page URL and uses the notion.so API to retrieve the corresponding task
 * information.
 *
 * Note: this adapter uses notion.so's internal v3 API as there is no public
 * API yet.
 */

import { match } from "micro-match";

import client from "../client";
import type { TicketData } from "../types";

type NotionTicketInfo = {
  value: {
    id: string;
    type: string;
    properties: Record<string, string[][]>;
  };
};

type NotionTicketResponse = {
  results: NotionTicketInfo[];
};

/**
 * Turns a slugged page ID without dashes into a dasherized RFC 4122 UUID.
 * UUID-Format: 96ec637d-e4b0-4a5e-acf3-8d4d9a1b2e4b
 */
function uuid(slugId: string | null) {
  if (!slugId) return null;

  return [
    slugId.substring(0, 8),
    slugId.substring(8, 12),
    slugId.substring(12, 16),
    slugId.substring(16, 20),
    slugId.substring(20),
  ].join("-");
}

function getPageFromPath(path: string) {
  const { slug } = match(":organization?/:slug", path);
  if (!slug) return null;

  return slug.replace(/.*-/, ""); // strip title from slug
}

function getSelectedPageId(url: URL) {
  const { pathname: path, searchParams: params } = new URL(url.href);
  const isPageModal = params.has("p");
  const slugId = isPageModal ? params.get("p") : getPageFromPath(path);

  if (!slugId) return null;
  return slugId;
}

function extractTicketInfo(result: NotionTicketInfo) {
  const { value } = result;
  if (!value) return undefined;

  const { id, type } = value;
  if (type !== "page") return undefined;

  const title = value.properties.title[0][0];
  return { id, title, type };
}

function getTickets(response: NotionTicketResponse, id: string) {
  return (response.results || [])
    .map(extractTicketInfo)
    .filter((t) => t && t.id === id) as TicketData[];
}

async function scan(url: URL): Promise<TicketData[]> {
  if (url.host !== "www.notion.so") return [];

  const slugId = getSelectedPageId(url);
  const id = uuid(slugId);

  if (!id) return [];

  const api = client(`https://${url.host}`);
  const request = { json: { requests: [{ table: "block", id }] } };
  const response = await api
    .post("api/v3/getRecordValues", request)
    .json<NotionTicketResponse>();

  return getTickets(response, id).map((ticket) => ({
    url: `https://www.notion.so/${slugId}`,
    ...ticket,
  })) as TicketData[];
}

export default scan;
