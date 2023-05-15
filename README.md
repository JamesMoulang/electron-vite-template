This project is designed as a starting point for a Steam game running on Electron from development to distribution. Just clone it, add your game files, and start working.

- [steamworks.js](https://github.com/ceifa/steamworks.js) for Steamworks SDK
- Notarisation on macOS
- Vite for dev server and bundling assets
- electron-builder to package as an app and notarise for macOS
- Script to upload to Steam

Read the notes I made while setting this up [here](https://github.com/JamesMoulang/electron-notes)

# Structure of this project

```
electron-vite-template
├── scripts
├── production    // electron app, steam integration
|   ├── main.js                 // electron main process, talks to renderer process with IPC
|   ├── steam_manager.js        // <-> steamworks.js <-> Steamworks SDK
|   └── save_manager.js         // edits local files
└── development   // game files, served/built by vite
    ├── public/game-assets    // images/audio/etc.
    ├── index.html            // main game html page
    └── src                   // scripts
```

![alt text](https://github.com/JamesMoulang/electron-vite-template/blob/main/structure.png?raw=true)

# Typical workflow

1. Clone and rename with `git clone https://github.com/JamesMoulang/electron-vite-template.git newname`
1. Run `yarn appi` to update `appBundleId` `savefilename` and `name` in `production/package.json`
1. Update app icons in `production/build_assets`
2. Set up environment variables: `export STEAM_PASSWORD=password` `STEAM_ACCOUNT` `APPLE_ID` `APPLE_ID_PASSWORD`
3. Add game development assets in `development`
4. Run `yarn install_all` to install node modules in `root`, `production`, and `development`
5. `yarn dev` -> `yarn build` -> `yarn start` -> `yarn dist` to go from development, to building static assets, to testing a local electron app, to packaging a distributable.

## Individual commands

| Command                   | Description                                                                                           |
| --------------------------| ----------------------------------------------------------------------------------------------------- |
| `appi`                    | Initialise some values in `production/package.json`                                                   |
| `install_all`             | Run `yarn install` in `root`, `production`, and `development`                                         |
| `dev`                     | Run a dev server to host the contents of `development`                                                |
| `build`                   | Build the contents of `development` and copy into `production`                                        |
| `preview`                 | Preview the static-asset version of the game in `development/dist`                                    |
| `start`                   | Run the electron app locally (without building a distributable)                                       |
| `bs`                      | Run `build` and run `start` immediately afterwards                                                    |
| `dist`                    | Build a distributable electron app and notarise on macOS                                              |
| `dist_final`              | Same as `dist` but with dev tools disabled                                                            |
| `copy_built`              | Copy from `development/dist` into `production`                                                        |
| `build_no_copy`           | Build without copying into `production`                                                               |
| `install_steamcmd_osx`    | Install `steamcmd` in the root directory                                                              |
| `steam_mac`               | Upload game files to steam using the config in `scripts/steam_build_mac_os.vdf`                       |
