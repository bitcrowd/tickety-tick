# ![ticket icon](./src/icons/icon-32.png) Tickety-Tick

[![Build Status](https://circleci.com/gh/bitcrowd/tickety-tick.svg?style=svg)](https://circleci.com/gh/bitcrowd/tickety-tick)

> #### How do you name this branch? What is the message for that commit?
> A browser extension to generate these for you, based on the ticket you're working on.

![Tickety-Tick's user interface](./screenshots/interface.png)

At [bitcrowd](https://bitcrowd.net/) we love conventions. One of them is how we name branches and commits. This makes it easy to relate a particular branch or commit to a certain ticket.

**Branches** follow the format `type/id-title` by default, where:

- `type` is usually one of:
  - `feature` (default)
  - `bug`
  - `chore`
  - …
- `id` is the identifier of the ticket in your ticketing system
- `title` is a lowercase, dasherized version of the ticket title

**Commits** contain `[#id] title` by default.

Additionally, Tickety-Tick generates [**commands**](#generated-commands) to set up a branch with the proper name and to prepare the commit message for your source code management tool. Out of the box, it is set up to work with Git.

If you need your commit messages, branch names or commands to look different, you can [configure](#advanced-configuration) Tickety-Tick to use a custom format.

## Demo

Here is a short example for how a possible workflow with Tickety-Tick could look like:

https://user-images.githubusercontent.com/3491815/165905554-5162a625-f2bd-4ea1-9bcd-5d712e31e33e.mp4

## Supported ticket systems

Tickety-Tick helps you create branches and commits for a few ticket systems.

Currently, we support:

- [GitHub](https://github.com/)
- [GitLab](https://gitlab.com/)
- [Jira](https://www.atlassian.com/software/jira)
- [Linear](https://linear.app)
- [Notion](https://www.notion.so/)
- [Tara](https://app.tara.ai/)
- [Trello](https://trello.com/)
- [YouTrack](https://www.jetbrains.com/youtrack/)

Your ticket system is missing? Go ahead and implement an adapter for it! We are always happy about contributions and here to support you 👋.

## Installation

Tickety-Tick is available for every major browser:

- [Chrome/Chromium](https://chrome.google.com/webstore/detail/ciakolhgmfijpjbpcofoalfjiladihbg)
- [Firefox](https://addons.mozilla.org/firefox/addon/tickety-tick/)
- [Opera](./OPERA.md)
- [Safari](./SAFARI.md) - experimental 🧪

### Manual Installation

Manually install the extension if you want to use an older version or a beta version.

<details>
<summary>Click here for instructions</summary>

#### Chrome

Download and unpack a `chrome.zip` file from the [releases](https://github.com/bitcrowd/tickety-tick/releases). Then navigate to the [chrome://extensions](//chrome://extensions) page, enable "Developer mode", press "Load unpacked extension" and point to the unpacked folder.

#### Firefox

Download a `tickety_tick-<version>.xpi` file from the [releases](https://github.com/bitcrowd/tickety-tick/releases) and open it in Firefox.

#### Opera

Download and unpack a `chrome.zip` file from the [releases](https://github.com/bitcrowd/tickety-tick/releases). Then navigate to the [opera:extensions](opera:extensions) page, enable "Developer mode", press "Load unpacked extension" and point to the unpacked folder.
</details>

## Keyboard Shortcuts

| Shortcut                       | Description                       |
|--------------------------------|-----------------------------------|
| <kbd>Ctrl</kbd> + <kbd>t</kbd> | Open the extension's popup dialog |


## Building

In order to build the extension from source, run:

```shell
yarn install
yarn checks
yarn build
```

To build an [un-optimized version for development or debugging](https://webpack.js.org/configuration/mode/), use:

```shell
yarn build --mode=development
```

To only build for a specific browser, use:

```shell
yarn build:chrome
yarn build:firefox
```

## Installing a custom-built version

### Chrome

Navigate to the [chrome://extensions](//chrome://extensions) page, enable "Developer mode" and press "Load unpacked extension". Point it to the `dist/chrome` directory. Done.

### Firefox

If you just want to try out and debug the extension, go to [about:debugging#addons](//about:debugging#addons). Then press "Load Temporary Add-On" and select the built `manifest.json` from the `dist/firefox` extension directory.

If you want to install the extension permanently, you need to [enable unsigned add-ons](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox#w_what-are-my-options-if-i-want-to-use-an-unsigned-add-on-advanced-users). Then go to [about:addons](//about:addons), click on the small cog icon, select `Install Add-on From File…` and choose `dist/firefox`.

### Opera

Navigate to the [opera://extensions](//opera://extensions) page, enable "Developer mode" and press "Load unpacked extension". Point it to the `dist/chrome` directory. Done.

## Development

### Developing Tickety-Tick

For development use `yarn watch:[browser]`. This will watch the files and rebuild the extension whenever source files change.

To test-drive a development version, you can use:

```shell
yarn open:chrome
yarn open:firefox
```

You can run both `watch:[browser]` and `open:[browser]` scripts in parallel to automatically rebuild and reload the extension as you make changes.

#### Tips & Tricks 🎩

* Debugging
  * Firefox: use the developer tools to [debug the extension](https://extensionworkshop.com/documentation/develop/debugging/)
  * Chrome: right-click `inspect` on the popup or the settings page to open a separate debugger

### Running automated checks

To execute the automated source code checks, run:

```shell
yarn checks
```

Or, to run checks individually:

```shell
yarn stylelint
yarn lint
yarn test
```

Hint: You can append `--watch` and other options supported by [Jest](https://jestjs.io/docs/en/cli) to the test command, e.g.:

```shell
yarn test --watch
```

The lint commands accept options supported by [ESLint](https://eslint.org/docs/user-guide/command-line-interface) and [stylelint](https://stylelint.io/user-guide/usage/options), e.g.:

```shell
yarn lint --fix
yarn stylelint --fix
```

### Generating coverage reports

In order to generate code coverage reports locally, just run:

```shell
yarn test --coverage
```

To view an HTML version of the report:

```shell
open coverage/lcov-report/index.html
```

### Releasing a new version

Optionally check the extension configuration first _(a bug in Chrome [this issue](https://github.com/mozilla/web-ext/issues/3213) currently causes an error)_:

```shell
yarn lint:ext
```

Prepare the release by bumping the version and submitting the change as a pull request:

```shell
yarn prepare-release
```

Once the version change is on the `main` branch, you can trigger the release process:

```shell
yarn release
```

You will be prompted for Mozilla Add-Ons and Chrome Web Store API credentials. Alternatively, if you have [1Password CLI](https://1password.com/downloads/command-line/) installed and access to the `Tickety-Tick` vault, it will only ask you for access there.

## Insights

### Generated commands

As mentioned earlier, in addition to branch names and commit messages, Tickety-Tick generates commands to set up a branch with the proper name and to prepare the commit message.

By default, the code generated for copying will look like this:

```shell
git checkout -b BRANCH-NAME && git commit --allow-empty -m COMMIT-MESSAGE
```

These default generated commands make a few assumptions:

1. *You're using Git (obviously).*

    The branch names and commit messages Tickety-Tick generates may work with other version control systems, but the commands generated for copying specifically include Git.

1. *You squash commits from feature branches (or you're okay with empty commits).*

    When you work with feature branches and you squash them before merging, Git (and GitHub) allow you to combine the messages of the feature-branch commits. The empty commit provides a simple mechanism for storing the commit message title generated by Tickety-Tick when setting up the branch.

This approach works nicely with our Git workflow, for which the above assumptions are true. Yours may be different though, in which case you might want to [configure](#advanced-configuration) Tickety-Tick differently.

### Advanced configuration

If you have different conventions regarding commit messages, branch names or you're just using a different source code management tool, Tickety-Tick allows you to customize the output format for all of these.

You can access the preferences page via the "Settings" link in the Tickety-Tick popup.

![Firefox preferences](./screenshots/firefox-preferences.png)

### Auto-formatting of commit messages

Tickety-Tick supports formatting generated commit messages according to [these recommendations](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) by [Tim Pope](https://github.com/tpope/). If you do not want this, you can disable this feature in the extension preferences (see above).
