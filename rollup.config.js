import { babel } from '@rollup/plugin-babel';
export default {
    input: "./Vue.js",
    output: {
        name: "Vue",
        dir: 'dist',
        format: 'iife'
    },
    plugins: [babel()]
}