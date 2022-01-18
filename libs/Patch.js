export function patch(oldVnode, vnode) {
    // 查看是否是虚拟元素
    // const isRealElement = oldVnode.parentNode
    // if (isRealElement) {
    //     const oldElm = oldVnode
    //     const parentNode = oldVnode.parentNode
    //     parentNode.insertBefore(vnode, oldElm.nextSibling)
    //     parentNode.removeChild(oldElm)
    //     return vnode
    // } else {
    //     console.log(this)
    //     return vnode
    //     // diff算法
    // }
    // 
    diffChildren(oldVnode || new frameElement(), vnode)
    return oldVnode
    
}
function diffSimple(oldNode, newNode) {
    // 类型不同
    if (oldNode.nodeType !== newNode.nodeType) {
        return oldNode.parentNode.replaceChild(newNode, oldNode)
    }
    // 类型一样，文本不一样
    if (oldNode.innerText !== newNode.innerText) {
        return oldNode.textContent = newNode.textContent
    }
    // 类型一样，并且是标签，需要根据新节点属性更新老节点属性
    return updateProps(oldNode, newNode)
}
const needUpdateKey = ['style', 'className', 'id', 'type']
function updateProps(oldNode, newNode) {
    for(let key in needUpdateKey) {
        const prop = newNode[key]
        if (typeof prop === 'object') {
            for (let key in prop) {
                updateProps(oldProp[key], prop)
            }
        } else {
            oldNode[key] = newNode[key]
        }
    }
    return oldNode
}
function diffChildren(oldNode, newNode) {
    const newChildren = newNode.children
    const oldChildren = oldNode.children
    if (oldChildren.length > 0 && newChildren.length > 0) {
        // 老的有儿子，新的有儿子
        updateChildren(oldNode, oldChildren, newChildren)
    } else if (oldNode.children.length > 0 ) {
        // 老的有儿子，新的没儿子
        oldNode.innerHtml = ''
    } else if (newChildren.length > 0) {
        // 老的没儿子，新的有儿子
        Array.from(newChildren).forEach(ele => {
            oldNode.appendChild(ele)
        })
    } else {
        // 都没有,直接返回老节点
    }
    return oldNode
}
function createMapByIndex (oldChildren) {
    let map = {}
    for (let i = 0; i< oldChildren.length; i++) {
        let current = oldChildren[i]
        if (current.key) {
            map[current.key] = current
        } else {
            map[i] = current
        }
    }
    return map
}
function updateChildren(parent, oldChildren,newChildren) {
    // 获取老的标识
    oldChildren = Array.from(oldChildren)
    newChildren = Array.from(newChildren)
    let oldStartIndex = 0
    let oldStartNode = oldChildren[oldStartIndex]
    let oldEndIndex = oldChildren.length - 1
    let oldEndNode = oldChildren[oldEndIndex]
    let map = createMapByIndex(oldChildren)
    // 获取新的标识
    let newStartIndex = 0
    let newStartNode = newChildren[newStartIndex]
    let newEndIndex = newChildren.length - 1
    let newEndNode = newChildren[newEndIndex]
    // 谁先结束说明，后面的均未新增
    while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartNode) {
            oldStartNode = oldChildren[++oldStartIndex]
        } else if (!oldEndNode) {
            oldEndNode = oldChildren[--newEndIndex]
        } else if (isSameNode(oldStartNode, newStartNode)) {
            diffSimple(oldStartNode, newStartNode)
            oldStartNode = oldChildren[++oldStartIndex]
            newStartNode = newChildren[++newStartIndex]
        } else if (isSameNode(oldEndNode, newEndNode)) {
            diffSimple(oldEndNode, newEndNode)
            oldEndNode = oldChildren[--oldEndIndex]
            newEndNode = newChildren[--newEndIndex]
        } else if (isSameNode(oldStartNode,newEndNode)) {
            diffSimple(oldStartNode, newEndNode)
            mountElement(parent, oldStartNode, oldEndNode.nextSibling)
            oldStartNode = oldChildren[++oldStartIndex]
            newEndNode = newChildren[--newEndIndex]
        } else if (isSameNode(oldEndNode, newStartNode)) {
            diffSimple(oldEndNode, newStartNode)
            mountElement(parent, oldEndNode, oldStartNode)
            oldEndNode = oldChildren[--oldEndIndex]
            newStartNode = newChildren[++newStartIndex]
        } else {
            // 都不一样,通过新的节点的key去找
            let toMoveNode = map[newStartNode.key]
            if (toMoveNode == null) {
                mountElement(parent, newStartNode, oldStartNode)
            } else {
                diffSimple(toMoveNode, newStartNode)
                mountElement(parent, toMoveNode, oldStartNode)
                oldChildren[newStartIndex] = void 0
            }
            newStartNode = newChildren[++newStartIndex]
            oldStartNode = oldChildren[++oldStartIndex]
        }
    }
    if (newStartIndex <= newEndIndex) {
        for(let i = newStartIndex; i<=newEndIndex; i++) {
            let beforeELement = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1]
            mountElement(parent, newChildren[i], beforeELement)
            // parent.appendChild(newChildren[i])
        }
    }
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i<= oldEndIndex; i++) {
            if (oldChildren[i]) {
                parent.removeChild(oldChildren[i])
            }
        }
    }
}
// export function mountElement (vm) {
//     // 调用target的beforeDestory
//     // beforeMount(node)
//     mountElement = function (parent, target, node) {
//         vm.$beforeDestory && vm.$beforeDestory()
//         parent.insertBefore(target,node)
//         // mounted(node)
//         vm.$destoryed && vm.$destoryed()
//     }
// }
export function mountElement (parent, target, node) {
    // vm.$beforeDestory && vm.$beforeDestory()
    parent.insertBefore(target,node)
    // mounted(node)
    // vm.$destoryed && vm.$destoryed()
}
function isSameNode(oldNode, newNode) {
    return oldNode.key === newNode.key && oldNode.type === newNode.type
}