import { $has, $text } from './helpers';

async function scan(loc, doc) {
  if (loc.host !== 'trello.com') return null;
  if (!$has('.card-detail-window', doc)) return null;

  const id = loc.pathname.match(/\/([\d]+)-[^/]+$/)[1];
  const title = $text('.card-detail-title-assist', doc);
  const type = 'feature';

  const tickets = [{ id, title, type }];

  return tickets;
}

export default scan;
