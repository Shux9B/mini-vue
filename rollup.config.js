import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import json from '@rollup/plugin-json';
export default {
    input: "./Vue.js",
    output: {
        name: "Vue",
        dir: 'dist',
        format: 'umd'
    },
    plugins: [json(), nodeResolve(), commonjs(), injectProcessEnv({
        env: {}
    }), babel()]
}