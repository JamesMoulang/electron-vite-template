const steamworks = require('steamworks.js');

let steamworks_client, ipc, mainWindow;

const getSteamId = () => {
	if (!steamworks_client) return null;

	return steamworks_client.localplayer.getSteamId();
};

const init = (_mainWindow, _ipc, steamapp_id=480) => {
	// we'll use these later.
	mainWindow = _mainWindow;
	ipc = _ipc;

	// initialise steamworks.
	// note: on macOS x64 this failed unless I was on v1.5.2 of the steamworks SDK
	steamworks_client = steamworks.init(steamapp_id);
	
	console.log(`Initialised steamworks, username is ${steamworks_client.localplayer.getName()}.`);

	// enable overlay
	steamworks.electronEnableSteamOverlay();

	// -------------------------------------------------------------
	// Bind functions to Inter Process Connection

	// get steam username (to test initialisation worked, mainly)
	ipc.on('get_steam_name', (event) => {
		event.returnValue = steamworks_client.localplayer.getName();
	});

	// trigger achievements
	ipc.on('trigger_achievement', (event, achievement_name) => {
		steamworks_client.achievement.activate(achievement_name);
	});

	ipc.on('check_achievement', (event, achievement_name) => {
		event.returnValue = steamworks_client.achievement.isActivated(achievement_name);
	});
};

module.exports = {init, getSteamId};