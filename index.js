import Vue from "./Vue.js"
let instance = new Vue({
    data: {
        a: 1,
        b: [1,0,4]
    },
    render () {
        console.log('触发并打印了：', this.a)
    }
})

// instance.a = 2
// instance.a = 3
// instance.a = 4
console.log(instance.b)
instance.b.push(9)
console.log(instance.b)
