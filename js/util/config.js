"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpcClientId = exports.gameURL = exports.appIcon = exports.appName = exports.isDev = void 0;
const electron_store_1 = __importDefault(require("electron-store"));
const config_json_1 = __importDefault(require("../../config.json"));
const path_1 = require("path");
exports.isDev = process.env.NODE_ENV !== 'production';
exports.appName = 'Official Kour.io Client';
exports.appIcon = (0, path_1.join)(__dirname, '../../assets/icon.png');
exports.gameURL = new URL('https://kour.io');
exports.rpcClientId = '1091132902370197614';
exports.default = new electron_store_1.default({ defaults: config_json_1.default });
