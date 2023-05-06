const fs = require('fs');
const readline = require('readline');

// Read the contents of the package.json file
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Create a readline interface to read inputs from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt the user for the new package name
rl.question('Enter a new package name: ', function(newName) {
  // Update the name field in the package.json object
  packageJson.name = newName;

  // Prompt the user for the new app bundle ID
  rl.question('Enter a new app bundle ID: ', function(newAppBundleId) {
    // Update the appBundleId field in the package.json object
    packageJson.appBundleId = newAppBundleId;

    // Write the updated package.json object to the file
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    console.log('package.json has been updated!');
    rl.close();
  });
});
