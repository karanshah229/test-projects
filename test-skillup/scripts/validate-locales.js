const fs = require('fs');
const path = require('path');

function validateJSON(json) {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
}

function validateJSONFilesInDir(dir) {
  const dirContent = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < dirContent.length; i = i + 1) {
    if (dirContent[i].isDirectory()) {
      const subdir = path.resolve(`${dir}/${dirContent[i].name}`);
      validateJSONFilesInDir(subdir);
    } else {
      const file = dirContent[i];
      if (file.name.endsWith('.json') === true) {
        const filePath = path.resolve(dir, dirContent[i].name);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (!validateJSON(fileContent)) {
          throw new Error(`❌ ${filePath} is not valid JSON`);
        } else console.log(`✅ ${filePath} validated`);
      }
    }
  }
}

function validateLocales() {
  const localeFolder = path.resolve('', 'public/locales');
  validateJSONFilesInDir(localeFolder);
}

validateLocales();
