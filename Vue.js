import Watcher from "./libs/core/Watcher.js";
import Observer from "./libs/core/Observer.js";
import { compile2Func } from './libs/VirtualDOM.js'
import { mountComponent, lisfeCycleMixin } from "./libs/LifeCycle.js";
export default class {
    constructor(options) {
        const vm = this
        this.$options = options
        this.__init()

    }
    __init() {
        this.__initMixins()
        this.__initState()
        this.__initListener()
        // 判断是否是根节点
        if (this.$options.el) {
            this.$el = document.querySelector(this.$options.el)
            new Watcher(this.$mount.bind(this, this.$el))
        } else {
            // this.$mount()
            new Watcher(this.$mount)
        }
    }
    __initState() {
        const vm = this
        let data = vm.$options.data
        data = typeof data === 'function' ? data.call(vm) : data
        data = new Observer(data)
        for (let dataKey of Object.getOwnPropertyNames(data)) {
            Object.defineProperty(vm, dataKey, {
                get() {
                    return data[dataKey]
                },
                set(val) {
                    data[dataKey] = val
                }
            })
        }
        // new Watcher(data)
    }
    $mount(el) {
        const vm = this
        const opts = vm.$options
        if (!opts.render) {
            if (!opts.template) {
                // 外部包裹el
                opts.template = el.outerHTML
            }
            opts.render = compile2Func(opts.template, opts)
        }
        mountComponent(vm, el)
    }
    __initMixins() {
        lisfeCycleMixin(this)
    }
    __initListener() {
        this.$on = new WeakMap()
        const vm = this
        const methods = vm.$options.methods
        if (methods) {
            for (let methodsKey of Object.getOwnPropertyNames(methods)) {
                Object.defineProperty(vm, methodsKey, {
                    get() {
                        return methods[methodsKey]
                    }
                })
            }
        }
    }
}