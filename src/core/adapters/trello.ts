/**
 * Trello adapter
 *
 * The adapter extracts the identifier of the selected card (short link) from
 * the page URL and uses the Trello API to retrieve the corresponding card
 * information.
 *
 * https://developers.trello.com/v1.0/reference#introduction
 *
 * Card view: https://trello.com/c/<SHORT-LINK>/1-ticket-title
 */

import { match } from "micro-match";

import client from "../client";
import type { TicketData } from "../types";

type TrelloTicketInfo = {
  name: string;
  desc: string;
  shortLink: string;
  shortUrl: string;
};

function extractTicketInfo(response: TrelloTicketInfo) {
  const {
    desc: description,
    name: title,
    shortLink: id,
    shortUrl: url,
  } = response;

  return {
    id,
    title,
    description,
    url,
  };
}

const requestOptions = {
  searchParams: { fields: "name,desc,shortLink,shortUrl" },
};

async function scan(url: URL): Promise<TicketData[]> {
  if (url.hostname !== "trello.com") return [];

  const { key } = match("/c/:key/:slug", url.pathname);

  if (!key) return [];

  const trello = client("https://trello.com/1");
  const response = await trello
    .get(`cards/${key}`, requestOptions)
    .json<TrelloTicketInfo>();
  const ticket = extractTicketInfo(response);

  return [ticket];
}

export default scan;
