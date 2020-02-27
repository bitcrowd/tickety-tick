export const summary = '[#{id}] {title}';

export const branch = '{type | slugify}/{id | slugify}-{title | slugify}';

export const commit = '[#{id}] {title}\n\n{description}\n\n{url}';

export const command = 'git checkout -b {branch | shellquote} && git commit --allow-empty -m {commit | shellquote}';
