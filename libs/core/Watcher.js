
import { beforeUpdate, updated } from "../LifeCycle"
export let GlobalFunc = null
export default class {
    constructor (fn, vm) {
        // 1. 通过wapperFn每次都将会重新调用fn
        function wapperFn () {
            // 这里是beforeUpdate
            vm.$beforeUpdate()
            GlobalFunc = wapperFn
            fn()
            GlobalFunc = null
            //这里是updated
            vm.$updated()
        }
        // 1. 只会触发一次fn调用
        wapperFn()
        // console.log("触发了")
        // GlobalFunc = fn
        // fn()
        // GlobalFunc = null
    }
}