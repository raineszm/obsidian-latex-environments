const fs = require('fs');
const path = require('path');
module.exports.readVersion = function (contents) {
  return 'PREVIOUS';
};

module.exports.writeVersion = function (contents, version) {
  const manifestPath = path.join(__dirname, '/../manifest.json');
  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, { encoding: 'utf8' }),
  );
  const appVersion = manifest['minAppVersion'];
  let versions = JSON.parse(contents);
  versions[version] = appVersion;
  return JSON.stringify(versions);
};
