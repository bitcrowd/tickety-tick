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

import { match } from 'micro-match';

import client from '../client';

/**
 * Turns a slugged page ID without dashes into a dasherized RFC 4122 UUID.
 * UUID-Format: 96ec637d-e4b0-4a5e-acf3-8d4d9a1b2e4b
 */
function uuid(slugId) {
  return [
    slugId.substring(0, 8),
    slugId.substring(8, 12),
    slugId.substring(12, 16),
    slugId.substring(16, 20),
    slugId.substring(20),
  ].join('-');
}

function getPageFromPath(path) {
  const { slug } = match('/:organization/:slug', path);
  if (!slug) return null;

  return slug.replace(/.*-/, ''); // strip title from slug
}

function getSelectedPageId(loc) {
  const { pathname: path, searchParams: params } = new URL(loc.href);
  const isPageModal = params.has('p');
  const slugId = isPageModal ? params.get('p') : getPageFromPath(path);

  if (!slugId) return null;
  return uuid(slugId);
}

function extractTicketInfo(result) {
  const { value } = result;
  if (!value) return null;

  const { id, type } = value;
  if (type !== 'page') return null;

  const title = value.properties.title[0][0];
  return { id, title, type };
}

function getTickets(response, id) {
  return (response.results || [])
    .map(extractTicketInfo)
    .filter(Boolean)
    .filter((t) => t.id === id);
}

async function scan(loc) {
  if (loc.host !== 'www.notion.so') return [];

  const id = getSelectedPageId(loc);

  if (!id) return [];

  const api = client(`https://${loc.host}`);
  const request = { json: { requests: [{ table: 'block', id }] } };
  const response = await api.post('api/v3/getRecordValues', request).json();

  return getTickets(response, id);
}

export default scan;
