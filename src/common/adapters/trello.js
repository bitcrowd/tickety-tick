// Trello adapter
//
// This adapter extracts the identifier of the selected card (short link) from
// the page URL and uses the Trello API to retrieve the corresponding card
// information.
//
// https://developers.trello.com/v1.0/reference#introduction
//
// Card view: https://trello.com/c/<SHORT-LINK>/1-ticket-title

import match from 'micro-match';

import client from '../client';

async function scan(loc) {
  const { host, pathname } = loc;

  if (host !== 'trello.com') return null;

  const { key } = match('/c/:key/:slug', pathname);

  if (!key) return null;

  const trello = client('https://trello.com/1');
  const response = await trello.get(`cards/${key}`).json();

  const { idShort: id, name: title } = response;
  const ticket = { id, title, type: 'feature' };

  return [ticket];
}

export default scan;
