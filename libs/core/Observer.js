import Dep from "./Dep.js"
export default class {
    constructor(target) {
        
        Object.defineProperty(target, '_dep', {
            enumerable: false,
            value: new Dep()
        })
        for (let k in target) {
            let initVal = target[k]
            Object.defineProperty(target, k, {
                get() {
                    target._dep.depend()
                    return initVal
                },
                set(val) {
                    if (initVal !== val) {
                        initVal = val
                        target._dep.notify()
                    }
                }
            })
        }
        return target
    }
}