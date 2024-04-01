import { get } from 'http';
import { existsSync, readFileSync } from 'fs';
import yaml from 'yaml';
import { join } from 'path';
import bakedBetas from '../../betas.json';

let betas: string[];

export async function getBetas(): Promise<string[]> {
    let appUpdateYml =
        existsSync(join(__dirname, '../../../app-update.yml')) &&
        readFileSync(join(__dirname, '../../../app-update.yml'), 'utf8');
    let parsedYml: any;

    if (!betas && appUpdateYml) {
        try {
            parsedYml = yaml.parse(appUpdateYml);
        } catch (e) {
            betas = bakedBetas;
            return betas;
        }

        let res = get(
            `https://raw.githubusercontent.com/${parsedYml.owner}/${parsedYml.repo}/main/betas.json`,
            {
                timeout: 3000,
            }
        );

        return await new Promise((resolve) => {
            let buffer = Buffer.alloc(0);
            res.on('data', (data) => (buffer = Buffer.concat([buffer, data])));
            res.on('error', () => {
                betas = bakedBetas;
                resolve(bakedBetas);
            });

            res.on('end', () => {
                try {
                    let betas = JSON.parse(buffer.toString());
                    resolve(betas);
                } catch (e) {
                    betas = bakedBetas;
                    resolve(bakedBetas);
                }
            });
        });
    } else betas = bakedBetas;

    return betas;
}
