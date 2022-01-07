import Dep from "./Dep.js"

const ArrayFunc = ['push', 'shift', 'pop', 'unshift', 'reverse', 'sort', 'splice']
export default class {
    #dep = new Dep()
    constructor(target) {
        for (let k in target) {
            let initVal = target[k]
            if (Array.isArray(initVal)) {
                this.#reactiveArray(k, initVal)
            } else {
                this.#reactiveCommon(k, initVal)
            }
            
        }
    }
    #reactiveCommon (key, initVal) {
        const vm = this
        Object.defineProperty(vm, key, {
            get() {
                vm.#dep.depend()
                return initVal
            },
            set(val) {
                if (initVal !== val) {
                    initVal = val
                    vm.#dep.notify()
                }
            }
        })
    }
    
    #reactiveArray (key, initVal) {
        const vm = this
        let obj = Object.create(Array.prototype)
        ArrayFunc.forEach(funName => {
            obj[funName] = function ()  {
                Array.prototype[funName].call(this, ...arguments)
                console.log(`拦截方法${funName}成功了`)
                vm.#dep.notify()
            }
        })
        let t = Object.create(obj)
        initVal.forEach(val => t.push(val))
        initVal = t
        // initVal = 
        Object.defineProperty(vm, key, {
            get() {
                vm.#dep.depend()
                return initVal
            },
            set(val) {
                if (initVal !== val) {
                    initVal = val
                    vm.#dep.notify()
                }
            }
        })
    }
}