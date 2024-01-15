import type { Config } from '@jest/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createTransformer } from 'ts-jest/presets';

const tsJestTransformer = createTransformer();

export default {
    process(src: string, filename: Config.Path, config: Config.ProjectConfig, options: Config.TransformOptions) {
        if (filename.match(/\.svg$/)) {
            return `module.exports = ${JSON.stringify({})}`; // Return an empty module for SVG files
        }
        return tsJestTransformer.process(src, filename, config, options);
    },
};
