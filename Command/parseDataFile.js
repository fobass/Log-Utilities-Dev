const fs = require('fs');
function parseDataFile(filepath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filepath));
    }
    catch (error) {
        return defaults;
    }
}
exports.parseDataFile = parseDataFile;
