# Maintainers 👔

Tips & tricks for maintainers of Tickety-Tick.

## Sign add-on for Firefox

Offering a (beta-) version for download requires self-signing the add-on through [addons.mozilla.org](https://extensionworkshop.com/documentation/publish/#distribute-your-signed-extension). This generates a `.xpi` for installing the extension in Firefox.

Find the API credentials in 1password and run:

```
yarn build:firefox && yarn sign 
```
