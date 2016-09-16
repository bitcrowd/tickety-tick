import { createSlug } from 'speakingurl';

const slugify = createSlug({ separator: '-' });

function normalize(s) {
  return slugify(s);
}

function commit(ticket) {
  return `[#${ticket.id}] ${ticket.title}`;
}

function branch(ticket) {
  return `${ticket.type || 'feature'}/${ticket.id}-${normalize(ticket.title)}`;
}

export default {
  normalize,
  commit,
  branch
};
