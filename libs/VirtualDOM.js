import { textContent } from 'domutils';
import { parseDocument } from 'htmlparser2'
const REGEX_VARIABLE = /\{\{[0-9a-zA-Z]*\}\}/g
export function compile2Func(template, opts) {
    const doms = parseDocument(template);
    console.log(doms)
    let code = genCode(doms.children[0])
    return new Function( `with(this){return ${code}}`)
}
function gen (node) {
    if (node.type === 'tag') {
        return genCode(node)
    } else if (node.type === 'text') {
        if (REGEX_VARIABLE.test(node.data)) {
           let tokens = []
           let match;
           let startIndex = REGEX_VARIABLE.lastIndex = 0
           while(match = REGEX_VARIABLE.exec(node.data)) {
               let endIndex = match.index
               if (endIndex > startIndex) {
                   tokens.push(JSON.stringify(node.data.slice(startIndex, endIndex)))
               }
               let varTitle = match[0].trim()
               tokens.push(`_s(${varTitle.slice(2,varTitle.length - 2)})`)
               startIndex = endIndex + match[0].length
           }
           if (startIndex < textContent.length) {
               tokens.push(JSON.stringify(node.data.slice(startIndex)))
           }
           return `_v(${tokens.join('+')})`
        } else {
            return `_v('${node.data}')`
        }
    }
}
function genCode(node) {
    return `_t('${node.name}', ${node.attribs ? JSON.stringify(node.attribs) : '{}'}, [${node.children && genChildren(node)}])`
}
function genChildren (ast) {
    const children = ast.children || []
    return children.map(child => gen(child)).join(',')
}
export function createElement (vm,tag, attrs, children) {
    console.log(tag, attrs, children)
    let t = document.createElement(tag)
    Array.from(children).forEach(ele => {
        t.appendChild(ele)
    })
    console.log(t)
    return t
}
export function createText (vm, text) {
    return document.createTextNode(Array.from(text).join(','))
}