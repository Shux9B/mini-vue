import Watcher from "./core/Watcher"
import {createElement, createText} from './VirtualDOM'
import { patch } from "./Patch"
export function lisfeCycleMixin(Vue) {
    Vue._v = function () {
        return createText(this, arguments)
    }
    Vue._t = function () {
        return createElement(this, ...arguments)
    }
    Vue._s = function () {
        return JSON.stringify(arguments[0])
    }
}
/**
 * 实现挂载流程
 * @param {*} vm 
 * @param {*} el HTMLElement
 */
export function mountComponent(vm, el) {
    const render = vm.$options.render
    let vnode = render.call(vm, vm._t)
    vm.$el = patch(vm.$el, vnode)
    // new Watcher()
}