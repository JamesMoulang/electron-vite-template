// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { name, productName, savefilename, devTools } = require('./package.json');

// managers
const steam_manager = require('./steam_manager');
const save_manager = require('./save_manager');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
      devTools,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow();

  // initialise steamworks - allows us to talk to steam API
  steam_manager.init(mainWindow, ipcMain, 1031900);

  console.log(`steam id is ${steam_manager.getSteamId().steamId64}.`);

  // initialise save manager - allows us to save/load game files
  save_manager.init(mainWindow, ipcMain, steam_manager.getSteamId().steamId64, `${savefilename}.json`, productName);

  ipcMain.on('close-me', function() {
    app.quit();
  });

  ipcMain.on('toggle_fullscreen', function() {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
    } else {
      mainWindow.setFullScreen(true);
    }
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') app.quit()

    app.quit();
});