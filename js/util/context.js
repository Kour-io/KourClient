"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const config_1 = require("./config");
var Context;
(function (Context) {
    Context[Context["Game"] = 0] = "Game";
    Context[Context["File"] = 1] = "File";
    Context[Context["External"] = 2] = "External";
})(Context || (exports.Context = Context = {}));
function getContext(url) {
    if (url.protocol === 'file:') {
        return Context.File;
    }
    if (url.hostname === config_1.gameURL.hostname) {
        return Context.Game;
    }
    return Context.External;
}
exports.default = getContext;
