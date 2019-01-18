import compile from './template';
import * as helpers from './helpers';

export { helpers };

/* eslint-disable no-template-curly-in-string */
export const defaults = {
  commit: '[#{id}] {title}',
  branch: '{type}/{id | slugify}-{title | slugify}',
  command: 'git checkout -b {branch | shellquote} && git commit --allow-empty -m {commit | shellquote}',
};
/* eslint-enable no-template-curly-in-string */

const fallbacks = {
  type: 'feature',
};

export default (templates = {}) => {
  const renderer = (name) => {
    const render = compile(templates[name] || defaults[name], helpers);
    return values => render({ ...fallbacks, ...values });
  };

  const commit = renderer('commit');
  const branch = renderer('branch');
  const cmd = renderer('command');

  const command = values => cmd({
    branch: branch(values),
    commit: commit(values),
    ...values,
  });

  return { branch, commit, command };
};
