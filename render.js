"use strict";
exports.__esModule = true;
var customtitlebar = require("custom-electron-titlebar");
const ipcRenderer = require('electron').ipcRenderer;

new customtitlebar.Titlebar({
        backgroundColor: customtitlebar.Color.fromHex('#505050'),
        icon: './images/icon.svg',
        shadow: false,
        enableMnemonics: true
    });

ipcRenderer.on('file-save', function() {
    console.log('save file!!!');
});
