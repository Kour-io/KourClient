import Store from 'electron-store';
import defaults from '../../config.json';
import { join } from 'path';

export const isDev = process.env.NODE_ENV !== 'production';
export const appName = 'Official Kour.io Client';
export const appIcon = join(__dirname, '../../assets/icon.png');
export const gameURL = new URL('https://kour.io');
export const rpcClientId = '1091132902370197614';

export default new Store({ defaults });
