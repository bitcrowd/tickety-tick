# Tickety-Tick [![Build Status](https://travis-ci.org/bitcrowd/tickety-tick.svg?branch=master)](https://travis-ci.org/bitcrowd/tickety-tick)

*How do you name this branch? What is the message for that commit?*

At bitcrowd we love conventions. One of them is how we name branches and
commits. This makes it easy to relate a particular branch or commit to a
certain ticket.

![screenshot](./screenshot.png)

**Branches** always follow the format `kind/id-title`, where:

- `kind` is usually one of:
  - `feature` (default)
  - `bug`
  - `chore`
  - …
- `id` is the identifier of the ticket in your ticketing system
- `title` is a lowercase, dasherized version of the ticket title

**Commits** always contain `[#id] title`.

Additionally, Tickety-Tick generates [**git commands**](#generated-commands) to
set up a branch with the proper name and to prepare the commit message.

## Supported ticket systems

Tickety-Tick helps you create branches and commits for a few ticket systems.

Currently, we support:

- GitHub
- GitLab
- JIRA
- Pivotal Tracker
- Trello

## Installation

Tickety-Tick is available for every major browser:

- [Chrome/Chromium](https://chrome.google.com/webstore/detail/ciakolhgmfijpjbpcofoalfjiladihbg)
- [Firefox](https://addons.mozilla.org/firefox/addon/tickety-tick/)
- [Opera](https://addons.opera.com/extensions/details/tickety-tick/)
- For Safari, you need to build it yourself (see below)

## Building

In order to build the extension from source, run:

```shell
yarn install
yarn run build
yarn run checks
```

For development use `yarn run watch`. This will watch the files and rebuild the
extension whenever source files change.

## Installing a custom-built version

### Chrome

Navigate to the [chrome://extensions](chrome://extensions) page, enable
"Developer mode" and press "Load unpacked extension". Point it to the
`dist/web-extension` directory. Done.

### Firefox

If you just want to try out and debug the extension, go to
[about:debugging#addons](about:debugging#addons). Then press "Load Temporary
Add-On" and select the `manifest.json` from the built extension directory.

### Opera

Same process as in [Chrome](#chrome).

### Safari

Open Safari and enable the "Developer Menu" in the application preferences. Now
go to the developer menu and open the "Extension Builder". Press the "+" button
and add the `dist/tickety-tick.safariextension` that you just built.

## Development

### Generating coverage reports

In order to generate code coverage reports locally, just run:

```shell
yarn run test:coverage
```

Then, to generate and view HTML reports:

```shell
./node_modules/.bin/nyc report --reporter lcov
open coverage/lcov-report/index.html
```

## Insights

### Generated commands

As mentioned earlier, in addition to branch names and commit messages,
Tickety-Tick generates git commands to set up a branch with the proper name
and to prepare the commit message.

The code generated for copying will look like this:

```shell
git checkout -b BRANCH-NAME && git commit --allow-empty -m COMMIT-MESSAGE
```

The generated commands make a few assumptions:

1. *You're using git (obviously).* The branch names and commit messages
   Tickety-Tick generates may work with other version control systems,
   but the commands generated for copying specifically include git.
2. *You squash commits from feature branches (or you're okay with empty commits).*
   When you work with feature branches and you squash them before merging, git
   (and GitHub) allow you to combine the messages of the feature-branch
   commits. The empty commit provides a simple mechanism for storing the commit
   message title generated by Tickety-Tick when setting up the branch.

This approach works nicely with our git workflow, for which the above
assumptions are true. Yours may be different though, in which case you may
still like Tickety-Tick's ability to generate the branch names and commit
messages for you.
