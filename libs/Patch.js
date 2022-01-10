export function patch (oldVnode, vnode) {
    // 查看是否是虚拟元素
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const oldElm = oldVnode
        const parentNode = oldVnode.parentNode
        parentNode.insertBefore(vnode, oldElm.nextSibling)
        parentNode.removeChild(oldElm)
    } else {
        // diff算法
    }
    return vnode
}