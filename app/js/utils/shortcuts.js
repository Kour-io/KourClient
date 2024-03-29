const { globalShortcut, remote } = require('electron');
const colors = require('colors');
let shortcuts = {};

const registerShortcut = (key, callback) => {
    globalShortcut.register(key, callback);
    shortcuts[key] = callback;
    console.log('Registered Keybind:'.bgCyan, key.magenta);
};

const unregisterShortcut = (key) => {
    if (shortcuts[key]) {
        globalShortcut.unregister(key);
        delete shortcuts[key];
    }
};

const unregisterAllShortcuts = () => {
    Object.keys(shortcuts).forEach((key) => {
        globalShortcut.unregister(key);
    });
    shortcuts = {};
};

module.exports = { registerShortcut, unregisterShortcut, unregisterAllShortcuts };
