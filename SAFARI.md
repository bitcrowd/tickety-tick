# Safari

You can build Tickety-Tick for Safari.

## Prerequisites

Install [Xcode](https://apps.apple.com/de/app/xcode/id497799835?l=en&mt=12) in addition to the install steps described in [README.md](./README.md#building).

You’ll also need a signing certificate.

The easiest way to create one might be this:

1. Open Xcode
2. Go to Xcode -> Settings > Accounts
3. Add an account of type “Apple ID”

— https://help.apple.com/xcode/mac/current/#/dev154b28f09

The certificate should show up in Keychain Access (app), usually as "Apple Development".

## Building & Installing

To build the extension for Safari, run:

```shell
yarn build:safari
```

If your signing certificate has a name that is not "Apple Development", use:

```shell
yarn build:chrome
yarn build:safari:xcodebuild <signing-identity-name>
```

You may be prompted to grant access to your signing identity during build.
This is not the build scripts themselves, but the Xcode tools invoked as a result.

Once the build succeeds, open `dist/safari/tickety-tick.app`.

This should install the extension. You just have to enable it.
