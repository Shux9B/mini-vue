import Vue from "./Vue.js"
let instance = new Vue({
    data: {
        a: 1,
        b: [1,0,4]
    },
    render () {
        console.log('触发并打印了a：', this.a)
        // console.log('触发并打印了b：', this.b)
    }
})

// instance.a = 2
// instance.a = 3
// instance.a = 4
instance.b.push(9)
instance.b.push(10)
instance.a = 3
