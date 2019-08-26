const electron = require('electron')
const path = require('path')
const fs = require('fs')
const parse = require('./parseDataFile.js')

class Store {

    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(userDataPath, opts.configName + '.json')

        this.data = parse.parseDataFile(this.path, opts.defaults);

    }

    get(key) {
        return this.data[key]

    }

    set(key, val) {
        this.data[key] = val
        fs.writeFileSync(this.path, JSON.stringify(this.data))

    }

}

module.exports = Store