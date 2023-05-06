A starter project, mainly for my own use, to set up a new electron project with steamworks.js functionality and notarisation on macOS.

# What is needed to publish an electron app?

1. Actually write the thing
2. Bundle the thing into static assets
3. Create a simple electron application that serves those static assets
4. Package the electron application (for multiple platforms)
5. Add native functionality to the electron app (if needed)
6. Allow the electron app's renderer process to talk to this native functionality
7. Notarise the app for macOS

# Actually writing the thing
Use [vite](https://vitejs.dev/guide/) to run a dev server.

```
yarn create vite
```

The basic structure of the project looks like this:

```
├── package.json
├── index.html (this is what is served when you connect to the dev server in a browser)
├── dist (this is created when it's bunled into static assets)
├── public
    ├── images
    └── audio
├── node_modules
└── src (contains project javascript files)
```

Then cd into the project and run `yarn` to initialise. Run the project using:

```
yarn dev
```

# Bundling the thing into static assets

```
yarn run build
```

This creates a folder called dist which has a structure that looks like this:
```
├── index.html (this is what is served when you connect to the dev server in a browser)
├── assets
    └── index-48f348fc.js (bundled javascript files)
├── images
└── audio
```

In order for images/audio to be included in dist they must be imported from somewhere within the js. For example:
```javascript
import img_tick from '/images/tick.png';
const img = new Image();
img.src = img_tick;
```

What we have at this point is a folder of static assets ready to be served by an electron app.

If you try to run this in a browser, it will kind of work, but complains about CORS. You can run a preview with:

```
yarn run vite preview
```

# Creating an electron app to serve static assets

I'll create the skeleton of the electron app by using [electron-quick-start](https://github.com/electron/electron-quick-start)

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
yarn
# Run the app
yarn run start
```

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.
- `preload.js` - A content script that runs before the renderer process loads.

Copy in assets, images, audio, and index.html to the electron app. (🔧 This is something I'd like to automate in the future).

In order to get this work, in our vite project we have to run

```
yarn vite build --base=./
```

to rewrite asset paths. Why? Because '/' in electron refers to the root directory of the file system, not the app's folder.

Let's edit the "build" command in package.json so we can just run:

```
yarn run build
```

# Packaging the electron app

We have a few options here. What's the best?

- electron-forge
- electron-builder
- electron-packager (which forge and builder both use)

Let's try electron-packager

```
yarn add -D electron-packager
yarn run electron-packager x
```

NOTE: seems like pnpm doesn't like electron-packager, and I wasn't able to get it to work. So I switched to yarn which seems to work fine.

## Packaging for other platforms

Platform values for the official prebuilt Electron binaries:

- `darwin` (macOS)
- `linux`
- `mas` (macOS, specifically for submitting to the Mac App Store)
- `win32`

> Building an Electron app for the Windows target platform requires editing the Electron.exe file. Currently, Electron Packager uses node-rcedit to accomplish this. A Windows executable is bundled in that Node package and needs to be run in order for this functionality to work, so on non-Windows host platforms (not including WSL), Wine 1.6 or later needs to be installed. On macOS, it is installable via Homebrew.

```
brew update
```

To build a windows version:

```
yarn electron-packager . --platform=win32
```

# Adding native functionality to the app

In our case, this is steam SDK.

I used [steamworks.js](https://github.com/ceifa/steamworks.js) - this only worked with [version 1.52](https://github.com/ceifa/steamworks.js/issues/93) of the Steamworks SDK.

Basic functionality in `main.js` of the electron app:

```javascript
const steamworks = require('steamworks.js');
steamworks_client = steamworks.init(480);
console.log(steamworks_client.localplayer.getName());
```

# Communicating between the renderer process and native functionality

This uses `electron.ipcMain`. Within `main.js` create a listener event:

```javascript
ipcMain.on('get_steam_name', (event) => {
  event.returnValue = steamworks_client.localplayer.getName();
});
```

Within `index.html` create a window function that calls it:

```javascript
const {ipcRenderer} = require('electron');
    
window.getSteamClient = () => {
    return ipcRenderer.sendSync('get_steamworks');
};
```

# Notarising for macOS

I tried [electron-notarize](https://github.com/electron/notarize), and had a lot of problems. Knowing electron-builder has some in-built support for electron-notarize I tried switching over to that, which did work.

This [stack overflow](https://stackoverflow.com/questions/64168569/electron-notarize-problem-not-signing-all-binaries) article was helpful.

I had to add this to `package.json`

```
"build": {
"mac": {
    "category": "public.app-category.developer-tools",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build_assets/mac/entitlements.plist",
    "entitlementsInherit": "build_assets/mac/entitlements.plist"
},
    "afterSign": "./scripts/notarize.js"
},
"scripts": {
    "start": "electron .",
    "app:dir": "electron-builder --dir",
    "app:dist": "electron-builder"
},
```

and create a `notarize.js` file that gets called automatically by `electron-builder`

```javascript
const { notarize } = require('electron-notarize');
const { appBundleId } = require('../package.json');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: 'my@email.com',
    appleIdPassword: 'one_time_password',
  });
};
```

I also had to renew my apple developer certificate, and made a new identifier for the app, because the last time i tried this, it apparently didn't work.

Still to figure out: how to build for other platforms with electron-builder
