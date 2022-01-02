import {GlobalFunc} from "./Watcher.js"
export default class {
    constructor() {
        this.listener = new Set()
    }
    depend() {
        if (GlobalFunc) {
            this.listener.add(GlobalFunc)
        }
    }
    notify() {
        this.listener.forEach(fn => fn())
    }
}