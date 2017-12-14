import { createSlug } from 'speakingurl';

import compile from './template';

/* eslint-disable no-template-curly-in-string */
export const defaults = {
  commit: '[#{id}] {title}',
  branch: '{type}/{id | slugify}-{title | slugify}',
  command: 'git checkout -b {branch | shellquote} && git commit --allow-empty -m {commit | shellquote}',
};
/* eslint-enable no-template-curly-in-string */

const lowercase = s => s.toLowerCase();
const shellquote = s => (typeof s === 'string' ? `'${s.replace(/'/g, '\'\\\'\'')}'` : '\'\'');
const slugify = createSlug({ separator: '-' });
const trim = s => s.replace(/^\s+|\s+$/g, '');
const uppercase = s => s.toUpperCase();

export const helpers = {
  lowercase,
  shellquote,
  slugify,
  trim,
  uppercase,
};

const fallbacks = {
  type: 'feature',
};

export default (templates = {}) => {
  const renderer = name => (mapfn) => {
    const render = compile(templates[name] || defaults[name], helpers);
    return values => render(mapfn({ ...fallbacks, ...values }));
  };

  const commit = renderer('commit')(values => values);
  const branch = renderer('branch')(values => values);
  const command = renderer('command')(values => ({
    branch: branch(values),
    commit: commit(values),
    ...values,
  }));

  return { branch, commit, command };
};
