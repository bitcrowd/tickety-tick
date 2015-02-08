# Ticket Git

At bitcrowd we love conventions. One of them is how we name branches and commits. This makes it easy to find the branch and/or commit for a certain ticket.

Branches always follow the format `type/id-title` and commits always `[#id] title`.

This chrome extension helps to create branches and commits for a few ticket systems.

Currently supported:

* Pivotal Tracker
* Jira

# Building

```
npm install
bower install
grunt build
```

For development use `grunt run`. This will watch the files and refresh the
content of the `chrome-extension` directory.

# ToDo

Currently this is only a Chrome extension. We should also support Safari and Firefox.

* [firefox clipboard example](https://github.com/fwenzel/copy-url)
* On Safari it is not possible to access clipboard?!
