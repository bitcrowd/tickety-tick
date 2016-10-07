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

function command(ticket) {
  return `git checkout -b ${branch(ticket)} && git commit --allow-empty -m '${commit(ticket)}'`;
}

export default {
  normalize,
  commit,
  branch,
  command
};
