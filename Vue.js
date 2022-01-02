import Watcher from "./libs/core/Watcher.js";
import Observer from "./libs/core/Observer.js";
import Mixins from "./libs/Mixins.js"
export default class {
    constructor ({data = {}, render = null}) {
        for(let dataKey in data) {
            this[dataKey] = data[dataKey]
        }
        let obs = new Observer(this)
        new Watcher(render.bind(this))
        return obs
    }
    Mixins(options) {

    }
}