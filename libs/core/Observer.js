import Dep from "./Dep.js"

const ArrayFunc = ['push', 'shift', 'pop', 'unshift', 'reverse', 'sort', 'splice']
export default class {
    __dep = {}
    constructor(target) {
        for (let k in target) {
            this.__dep[k] = new Dep()
            let initVal = target[k]
            if (Array.isArray(initVal)) {
                this.__reactiveArray(k, initVal)
            } else {
                this.__reactiveCommon(k, initVal)
            }
            
        }
    }
    __reactiveCommon (key, initVal) {
        const vm = this
        Object.defineProperty(vm, key, {
            get() {
                console.log(`依赖收集${key}`)
                vm.__dep[key].depend()
                return initVal
            },
            set(val) {
                if (initVal !== val) {
                    initVal = val
                    vm.__dep[key].notify()
                }
            }
        })
    }
    
    __reactiveArray (key, initVal) {
        const vm = this
        let obj = Object.create(Array.prototype)
        ArrayFunc.forEach(funName => {
            obj[funName] = function ()  {
                Array.prototype[funName].call(this, ...arguments)
                vm.__dep[key].notify()
            }
        })
        let t = Object.create(obj)
        initVal.forEach(val => t.push(val))
        initVal = t
        Object.defineProperty(vm, key, {
            get() {
                vm.__dep[key].depend()
                return initVal
            },
            set(val) {
                if (initVal !== val) {
                    initVal = val
                    vm.__dep[key].notify()
                }
            }
        })
    }
}