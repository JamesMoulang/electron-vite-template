import fs from 'fs';
import readline from 'readline';

const packageJson = JSON.parse(fs.readFileSync('production/package.json', 'utf8'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(`Enter a new package name (${packageJson.name}): `, function(newName) {
  packageJson.name = newName;

  rl.question(`Enter a new product name (${packageJson.productName}): `, function(newProductName) {
    packageJson.productName = newProductName;
    
    rl.question(`Enter a new app bundle ID (${packageJson.appBundleId}): `, function(newAppBundleId) {
      packageJson.appBundleId = newAppBundleId;

      rl.question(`Enter a new save file name (${packageJson.savefilename}): `, function(newSaveFileName) {
        packageJson.savefilename = newSaveFileName;

        rl.question(`Enter a new Steam app ID (or use 480 for Spacewar, a game every steam account owns): `, function(newSteamAppID) {
          packageJson.steamapp_id = newSteamAppID;

          // Write the updated package.json object to the file
          fs.writeFileSync('production/package.json', JSON.stringify(packageJson, null, 2));

          console.log('production/package.json has been updated!');
          rl.close();
        });
      });
    });
  });
});