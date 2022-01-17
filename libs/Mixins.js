export function mixinsComponent(componentOpt) {
    const inputMixins = componentOpt.mixins
    if (inputMixins) {
        // 混入data
        let optData = componentOpt.data
        if (typeof optData === 'function') {
            // 说明不是根组件先不处理，跟children一起作
            optData = optData()
        }
        // 假定只有object和function两种类型
        let mixinsData = inputMixins.map(m => m.data && m.data())
        mixinsData.unshift(optData)
        componentOpt.data = mixinsData.reduce(function (previousValue, currentValue) {
            for (let key in currentValue) {
                if (previousValue.hasOwnProperty(key)) {
                    debugger
                    // 被合并也有，则merge
                    if (typeof currentValue[key] === 'object') {
                        deepMerge(previousValue[key], currentValue[key])
                    }
                } else {
                    // 没有的直接赋值
                    previousValue[key] = currentValue[key]
                }
            }
            return previousValue;
        }, {})
        // 混入Hook,组件之前调用
        const mixinUpdated = inputMixins.map(m => m.updated ? m.updated : () => { })
        if (componentOpt.updated) {
            // 就处理updated的混入
            componentOpt.updated = [componentOpt.updated, ...mixinUpdated]
        } else {
            componentOpt.updated = [...mixinUpdated]
        }
        // 混入methods、components 和 directives,目前只处理methods
        let mixinsMethods = inputMixins.filter(m => m.methods)
        if (componentOpt.methods) {
            mixinsMethods.unshift(componentOpt.methods)
        }
        componentOpt.methods = mixinsMethods.reduce(function (previousValue, currentValue) {
            for (let key in currentValue.methods) {
                if (previousValue.hasOwnProperty(key)) {
                    // 被合并也有，则不处理
                } else {
                    // 没有的直接赋值
                    previousValue[key] = currentValue.methods[key]
                }
            }
            return previousValue;
        }, {})
    }
}
function deepMerge(sorce, input) {
    if (typeof sorce === typeof input) {
        // 类型相等再处理
        if (Array.isArray(sorce) && Array.isArray(input)) {
            // 都是数组
            debugger
            sorce.push(...input)
        } else {
            for (let key in input) {
                if (sorce.hasOwnProperty(key)) {
                    // 被合并也有，则merge
                    if (typeof sorce[key] === 'object') {
                        deepMerge(sorce[key], input[key])
                    }
                } else {
                    // 没有的直接赋值
                    sorce[key] = input[key]
                }
            }
        }
    }
}