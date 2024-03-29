"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const context_1 = __importStar(require("./context"));
const game_1 = require("../windows/game");
function handleWindowEvent(win, event, urlString) {
    event.preventDefault();
    let url;
    let currentUrl;
    try {
        url = new URL(urlString);
        currentUrl = new URL(win.webContents.getURL());
    }
    catch (e) {
        return;
    }
    let currentCtx = (0, context_1.default)(currentUrl);
    let ctx = (0, context_1.default)(url);
    if (ctx === currentCtx) {
        win.loadURL(urlString);
        return;
    }
    if (ctx === context_1.Context.Game) {
        game_1.window.loadURL(urlString);
        return;
    }
    electron_1.shell.openExternal(urlString);
}
exports.default = handleWindowEvent;
