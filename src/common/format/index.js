import compile from './template';
import * as helpers from './helpers';

export { helpers };

/* eslint-disable no-template-curly-in-string */
export const defaults = {
  branch: '{type}/{id | slugify}-{title | slugify}',
  commit: '[#{id}] {title}\n\n{description}\n\n{url}',
  command: 'git checkout -b {branch | shellquote} && git commit --allow-empty -m {commit | shellquote}',
};
/* eslint-enable no-template-curly-in-string */

const fallbacks = {
  type: 'feature',
};

const renderer = (templates, name) => {
  const render = compile(templates[name] || defaults[name], helpers);
  return values => render({ ...fallbacks, ...values }).trim();
};

export default (templates = {}) => {
  const branch = renderer(templates, 'branch');
  const commit = renderer(templates, 'commit');

  // eslint-disable-next-line no-underscore-dangle
  const _command = renderer(templates, 'command');
  const command = values => _command({
    branch: branch(values),
    commit: commit(values),
    ...values,
  });

  return { branch, command, commit };
};
