"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBetas = void 0;
const http_1 = require("http");
const fs_1 = require("fs");
const yaml_1 = __importDefault(require("yaml"));
const path_1 = require("path");
const betas_json_1 = __importDefault(require("../../betas.json"));
let betas;
async function getBetas() {
    let appUpdateYml = (0, fs_1.existsSync)((0, path_1.join)(__dirname, '../../../app-update.yml')) &&
        (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../app-update.yml'), 'utf8');
    let parsedYml;
    if (!betas && appUpdateYml) {
        try {
            parsedYml = yaml_1.default.parse(appUpdateYml);
        }
        catch (e) {
            betas = betas_json_1.default;
            return betas;
        }
        let res = (0, http_1.get)(`https://raw.githubusercontent.com/${parsedYml.owner}/${parsedYml.repo}/main/betas.json`, {
            timeout: 3000,
        });
        return await new Promise((resolve) => {
            let buffer = Buffer.alloc(0);
            res.on('data', (data) => (buffer = Buffer.concat([buffer, data])));
            res.on('error', () => {
                betas = betas_json_1.default;
                resolve(betas_json_1.default);
            });
            res.on('end', () => {
                try {
                    let betas = JSON.parse(buffer.toString());
                    resolve(betas);
                }
                catch (e) {
                    betas = betas_json_1.default;
                    resolve(betas_json_1.default);
                }
            });
        });
    }
    else
        betas = betas_json_1.default;
    return betas;
}
exports.getBetas = getBetas;
