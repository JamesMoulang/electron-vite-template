const fs_extra = require('fs-extra');

// windows
// process.env.APPDATA + \\..\\LocalLow\\James Moulang\\You Can Kana\\' + steam_id + '\\' + filename;

// macOS
// process.env.HOME + '/Application Support/James Moulang/You Can Kana/' + steam_id + '/' + filename;

// linux
// '~/James Moulang/You Can Kana/' + steam_id + '/' + filename;

const getHome = (steam_id, filename, gamename) => {
  // windows
  if (process.env.APPDATA)
    return `${process.env.APPDATA}\\..\\LocalLow\\James Moulang\\${gamename}\\${steam_id}\\${filename}`;

  // macOS
  if (process.platform == 'darwin')
    return `${process.env.HOME}/Library/Application Support/James Moulang/${gamename}/${steam_id}/${filename}`;

  // linux / all others
  return `~/James Moulang/${gamename}/${steam_id}/${filename}`;
};

let steam_id, filename, save_file_url, mainWindow, ipc, gamename;

const init = (_mainWindow, _ipc, _steam_id, _filename, _gamename) => {
  // we'll use these later
  mainWindow = _mainWindow;
  ipc = _ipc;
  steam_id = _steam_id;
  filename = _filename;
  gamename = _gamename;

  save_file_url = getHome(steam_id, filename, gamename);

  console.log(`save manager initialised with steam id ${steam_id}, filename ${filename} and save file url ${save_file_url}.`);

  // -------------------------------------------------------------
  // Bind functions to Inter Process Connection

  // save
  ipc.on('save', (event, data) => {

    console.log(`saving to ${save_file_url}`);

    fs_extra.outputFileSync(save_file_url, data, (err) => {
      if (err) {
        console.log("Error saving data");
        console.error(err);
      } else {
        console.log("Saved successfully.");
      }
    });

  });

  // load
  ipc.on('load', (event) => {

    console.log(`loading from ${save_file_url}`);

    try {
      event.returnValue = fs_extra.readFileSync(save_file_url, 'utf8');
    } catch (err) {
      event.returnValue = null;
    }

  });
};

module.exports = {init};