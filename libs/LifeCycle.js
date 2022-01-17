import {compile2Func, createElement, createText} from './VirtualDOM'
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
export function beforeUpdate (fn) {
    const fun = function () {
        console.log("触发了钩子：beforeUpdate")
        fn.call(this)
    }
    return fun
}
export function updated (fn) {
    const fun = function () {
        console.log("触发了钩子：updated")
        fn.call(this)
    }
    return fun
}
export function beforeMount (vm) {
}
export function mounted (vm) {
}
export function beforeDestory (fn) {
    const fun = function () {
        console.log("触发了钩子：updated")
        fn.call(this)
        // 清空watcher
        this._watcher = null
        // 清空listener
        for(let [dom, listener] of this.$on) {
            dom.removeEventListener(listener)
        }
    }
    return fun
}
export function destoryed (fn) {
    const fun = function () {
        fn.call(this)
    }
    return fun
}
const LifeCycleName = ['beforeCreated', 'created', 'beforeUpdate', 'updated', 'beforeMount','mounted', 'beforeDestory', 'destoryed']
import {mountElement} from './Patch'
export function __initLifecycle(vm) {
    if (vm.$options.updated) {
        vm.$updated = updated(vm.$options.updated)
    }
    if (vm.$options.beforeUpdate) {
        vm.$beforeUpdate = beforeUpdate(vm.$options.beforeUpdate)
    }
    if (vm.$options.destoryed) {
        vm.$destoryed = destoryed(vm.$options.destoryed)
    }
    if (vm.$options.beforeDestory) {
        vm.$beforeDestory = beforeDestory(vm.$options.beforeDestory)
    }
    mountElement(vm)
}