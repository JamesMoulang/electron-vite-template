# Structure
```
├── production: electron app, steam integration
└── development: game files, served/built by vite
```

# First time setup

- Run `yarn appi` to update `appBundleId` `savefilename` and `name` in `production/package.json`
- update app icons

# Scripts

`install_all`

run yarn install in `root` `production` `development`

`dev`

run a dev server to host the contents of `development`

`build`

build the contents of `development` and copy into `production`

`preview`

preview the static-asset version of the game in `development/dist`

`copy_built`

copy from `development/dist` into `production`

`build_no_copy`

build with copying into `production`
