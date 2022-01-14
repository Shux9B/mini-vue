import { textContent } from 'domutils';
import { parseDocument } from 'htmlparser2'
const REGEX_VARIABLE = /\{\{[0-9a-zA-Z]*\}\}/g
export function compile2Func(template, opts) {
    const doms = parseDocument(template);
    console.log(doms)
    let code = genCode(doms.children[0])
    let t = `with(this){return ${code.replace(/\"/g, "'")}}`
    return new Function(t)
}
function gen(node) {
    if (node.type === 'tag') {
        return genCode(node)
    } else if (node.type === 'text') {
        if (REGEX_VARIABLE.test(node.data)) {
            let tokens = []
            let match;
            let startIndex = REGEX_VARIABLE.lastIndex = 0
            while (match = REGEX_VARIABLE.exec(node.data)) {
                let endIndex = match.index
                if (endIndex > startIndex) {
                    tokens.push(JSON.stringify(node.data.slice(startIndex, endIndex)).trim())
                }
                let varTitle = match[0].trim()
                tokens.push(`_s(${varTitle.slice(2, varTitle.length - 2)})`)
                startIndex = endIndex + match[0].length
            }
            if (startIndex < textContent.length) {
                tokens.push(JSON.stringify(node.data.slice(startIndex)).trim())
            }
            return `_v(${tokens.join('+')})`
        } else {
            return `_v('${node.data.trim()}')`
        }
    }
}
function genCode(node) {
    return `_t('${node.name}', ${node.attribs ? JSON.stringify(node.attribs): '{}'}, [${node.children && genChildren(node)}])`
}
function genChildren(ast) {
    const children = ast.children || []
    return children.map(child => gen(child)).join(',')
}
const domAttrs = ['style', 'class', 'key', 'id', 'type', 'value', '@click']
export function createElement(vm, tag, attrs, children) {
    console.log(tag, attrs, children)
    let t = document.createElement(tag)
    domAttrs.forEach(key => {
        if (key.includes("@") && attrs[key]) {
            const handler = vm[attrs[key]].bind(vm)
            vm.$on.set(t, handler)
            t.addEventListener(key.replace(/@/, ''),handler)
        } else {
            t[key] = attrs[key]
        }
    })
    if (Array.isArray(children)) {
        Array.from(children).forEach(ele => {
            if (ele.nodeType) {
                t.appendChild(ele)
            } else {
                t.appendChild(createText(null, ele))
            }
        })
    } else {
        t.appendChild(createText(null, children))
    }
    return t
}
export function createText(vm, text) {
    if (typeof text !== 'string') {
        text = Array.from(text).join(',')
    }
    return document.createTextNode(text)
}