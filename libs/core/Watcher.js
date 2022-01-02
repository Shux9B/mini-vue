
export let GlobalFunc = null
export default class {
    constructor (fn) {
        // 1. 通过wapperFn每次都将会重新调用fn
        function wapperFn () {
            console.log("触发了")
            GlobalFunc = wapperFn
            fn()
            GlobalFunc = null
        }
        // 1. 只会触发一次fn调用
        wapperFn()
        // console.log("触发了")
        // GlobalFunc = fn
        // fn()
        // GlobalFunc = null
    }
}