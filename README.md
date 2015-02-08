# bitcrowd ticketsystem helper

This chrome extension helps to handle commits and branches the bitcrowd way.

We have bookmarklets to create a unique mapping between tickets and their git
branches. This extension does the same in a nicer way.

Currently supported ticket systems:

* Pivotaltracker
* Jira

# Building

```
npm install
bower install
grunt build
```

For development use `grunt run`. This will watch the files and refresh the
content of the `chrome-extension` directory.

# Important infos

* [firefox clipboard example](https://github.com/fwenzel/copy-url)
* On Safari it is not possible to access clipboard?!
