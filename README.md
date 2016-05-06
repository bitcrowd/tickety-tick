# Tickety-Tick

At bitcrowd we love conventions. One of them is how we name branches and
commits. This makes it easy to find the branch and/or commit for a certain
ticket.

![screenshot](src/data/screenshot.png)

Branches always follow the format `type/id-title` and commits always `[#id]
title`.

This chrome extension helps to create branches and commits for a few ticket
systems.

Currently supported:

* Pivotal Tracker
* Jira
* Github

# Installation

* [Chrome](https://chrome.google.com/webstore/detail/ciakolhgmfijpjbpcofoalfjiladihbg)
* [Firefox](https://addons.mozilla.org/de/firefox/addon/tickety-tick/)
* For Safari you need to build it yourself, see below

# Building

```
npm install
bower install
grunt build
```

For development use `grunt run`. This will watch the files and refresh the
content of the `chrome-extension` directory.

# Installation

## Chrome

Go to the [chrome extensions page](chrome://extensions/) and press "Load unpacked extension".
Point it to the `chrome-extension` directory. Done.

## Firefox

Download the [Firefox Addd-ons SDK](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation)
and go into the `firefox-extension` directory. Start a Firefox with `jpm run`.

To build the xpi for distribution, go into the `firefox-extension` directory and use `jpm xpi`.

## Safari

You need a [certificate](https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/Introduction/Introduction.html#//apple_ref/doc/uid/TP40009977-CH1-SW1)
to make the extension usable for you.

After you installed the certificate, open Safari, enable the Developer Menu in the settings,
go to the developer menu and open the extension builder. Press the + button and add the
`tickety-tick.safariextension` that was build by grunt.

# ToDo

* Rename
* Add nice layout
* Release
