# Structure
```
├── production: electron app, steam integration
└── development: game files, served/built by vite
```

# First time setup

- Run `yarn appi` to update `appBundleId` `savefilename` and `name` in `production/package.json`
- update app icons

# Scripts

## Typical workflow

`appi` -> `install_all` -> `dev` -> `build` -> `start` -> `dist`

## Individual commands

| Command       | Description                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `appi`        | Initialise some values in `production/package.json`                                                |
| `install_all` | Run `yarn install` in `root`, `production`, and `development`                                       |
| `dev`         | Run a dev server to host the contents of `development`                                              |
| `build`       | Build the contents of `development` and copy into `production`                                      |
| `preview`     | Preview the static-asset version of the game in `development/dist`                                  |
| `start`       | Run the electron app locally (without building a distributable)                                     |
| `dist`        | Build a distributable electron app and notarise on macOS                                            |
| `copy_built`  | Copy from `development/dist` into `production`                                                      |
| `build_no_copy` | Build without copying into `production`                                                             |
