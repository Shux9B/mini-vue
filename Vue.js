import Watcher from "./libs/core/Watcher.js";
import Observer from "./libs/core/Observer.js";
import { compile2Func } from './libs/VirtualDOM.js'
import { mountComponent, lisfeCycleMixin, __initLifecycle } from "./libs/LifeCycle.js";
import { mixinsComponent } from "./libs/Mixins.js";
import {GlobalComponents} from './libs/Componetns'
class Vue {
    constructor(options) {
        if (options === null) {
            return this
        }
        debugger
        this.$options = options
        this.__init()
        if (this.$options.el) {
            this.$el = document.querySelector(this.$options.el)
            this._watcher = new Watcher(this.$mount.bind(this, this), this)
        } else {
            // this.$mount()
            this._watcher = new Watcher(this.$mount.bind(this, this), this)
        }
    }
    __init() {
        this.__initMixins()
        this.__initListener()
        __initLifecycle(this)
        // this.__beforeCreated()
        this.__initState()
        // this,__initChildren()
        // this.__created()
        // 判断是否是根节点
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
    $mount(vm) {
        const opts = vm.$options
        if (!opts.render) {
            if (!opts.template) {
                // 外部包裹el
                opts.template = vm.$el.outerHTML
            }
            opts.render = compile2Func(opts.template, opts)
        }
        mountComponent(vm, vm.$el)
    }
    __initChildren () {
        this.Children
    }
    __initMixins() {
        lisfeCycleMixin(this)
        mixinsComponent(this.$options)
    }
    __initListener() {
        this.$on = new Map()
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
    static use(plugin, others) {
        if (plugin.install) {
            plugin.install(Vue, others)
        }
    }
    static component(componentName, options) {
        GlobalComponents[componentName] = options
    }
}
export default Vue