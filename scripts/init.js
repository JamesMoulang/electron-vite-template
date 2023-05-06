import fs from 'fs';
import readline from 'readline';

// Read the contents of the package.json file
const packageJson = JSON.parse(fs.readFileSync('production/package.json', 'utf8'));

// Create a readline interface to read inputs from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for the new package name
rl.question(`Enter a new package name, used as the application name (${packageJson.name}): `, function(newName) {
  // Update the name field in the package.json object
  packageJson.name = newName;

  // Prompt the user for the new app bundle ID
  rl.question(`Enter a new app bundle ID (${packageJson.appBundleId}): `, function(newAppBundleId) {
    // Update the appBundleId field in the package.json object
    packageJson.appBundleId = newAppBundleId;

    rl.question(`Enter a new save file name (${packageJson.savefilename}): `, function(newSaveFileName) {
      packageJson.savefilename = newSaveFileName;

      // Write the updated package.json object to the file
      fs.writeFileSync('production/package.json', JSON.stringify(packageJson, null, 2));

      console.log('production/package.json has been updated!');
      rl.close();
    });
  });
});
