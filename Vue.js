import Watcher from "./libs/core/Watcher.js";
import Observer from "./libs/core/Observer.js";
// import Mixins from "./libs/Mixins.js"
export default class {
    constructor (options) {
        const vm = this
        this.$options = options
        this.#init()
       
    }
    #init() {
        this.#initState()
        new Watcher(this.$options.render.bind(this))
        // 判断是否是根节点
        // if(this.$options.el) {

        // }
        
        // new initListener()
        // new InitLifeCycle()
        // this.beforeCreated()
        // new InitState()
        // this.beforeCreated()
        // if (el) {
        //     // 是用来挂载的Root节点
        //     this.$root = null
        // }
        // const componentRender = InitRender(render || template)
        // this.beforeMount()




        // if (created) {
        //  }
        // new Watcher(render.bind(this))
        // return obs
    }
    #initState () {
        const vm = this
        let data = this.$options.data
        data = typeof data === 'function' ? data.call(this) : data
        data = new Observer(data)
        for(let dataKey of Object.getOwnPropertyNames(data)) {
            Object.defineProperty(this, dataKey, {
                get () {
                    return data[dataKey]
                },
                set (val) {
                    data[dataKey] = val
                }
            })
        }
        // new Watcher(data)
    }
}