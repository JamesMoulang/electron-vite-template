```
electron-vite-template
├── scripts
├── production    // electron app, steam integration
    ├── main.js                 // electron main process, talks to renderer process with IPC
    ├── steam_manager.js        // <-> steamworks.js <-> Steamworks SDK
    └── save_manager.js         // edits local files
└── development   // game files, served/built by vite
    ├── public/game-assets    // images/audio/etc.
    ├── index.html            // main game html page
    └── src                   // scripts
```

![alt text](https://github.com/JamesMoulang/electron-vite-template/blob/main/structure.png?raw=true)

# Typical workflow

1. Run `yarn appi` to update `appBundleId` `savefilename` and `name` in `production/package.json`
1. Update app icons in `production/build_assets`
1. Add game development assets in `development`
1. Run `yarn install_all` to install node modules in `root`, `production`, and `development`
1. `yarn dev` -> `yarn build` -> `yarn start` -> `yarn dist` to go from development, to building static assets, to testing a local electron app, to packaging a distributable.

## Individual commands

| Command       | Description                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `appi`        | Initialise some values in `production/package.json`                                                |
| `install_all` | Run `yarn install` in `root`, `production`, and `development`                                       |
| `dev`         | Run a dev server to host the contents of `development`                                              |
| `build`       | Build the contents of `development` and copy into `production`                                      |
| `preview`     | Preview the static-asset version of the game in `development/dist`                                  |
| `start`       | Run the electron app locally (without building a distributable)                                     |
| `bs`          | Run `build` and run `start` immediately afterwards                                                  |
| `dist`        | Build a distributable electron app and notarise on macOS                                            |
| `dist_final`  | Same as `dist` but with dev tools disabled                                                          |
| `copy_built`  | Copy from `development/dist` into `production`                                                      |
| `build_no_copy` | Build without copying into `production`                                                             |
