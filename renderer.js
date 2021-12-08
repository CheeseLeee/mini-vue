

const h = (tag,props,children) => {
    let vnode = {
        tag,
        props,
        children
    }
    if(typeof tag === 'string'){
        return vnode
    }else if(isObject(tag)){                
        return tag.render()
    }    
}

const mount = (vnode,container) => {
    var el = vnode.el = document.createElement(vnode.tag)
    if(vnode.props){
        for(var k in vnode.props){
            if(k.startsWith('on')){
                var methodKey = k.toLowerCase().substring(2)
                el.addEventListener(methodKey,vnode.props[k])
            }else{
                var value = vnode.props[k]
                el.setAttribute(k,value)
            }

        }
    }
    if(vnode.children){
        if(typeof vnode.children === 'string'){
            el.textContent = vnode.children
        }else{
            vnode.children.forEach(element => {
                mount(element,el)
            });
        }
    }
    container.appendChild(el)
}

function patch(n1,n2){
    if(n1.tag !== n2.tag){
        const n1ElPartent = n1.el.parentNode
        n1ElPartent.removeChild(n1.el)
        mount(n2,n1ElPartent)
    }else{
        const el = n2.el = n1.el
        const oldProps = n1.props
        const newProps = n2.props
        for(var k in oldProps){
            if(oldProps[k] !== newProps[k]){

                if(k.startsWith('on')){
                    var methodKey = k.toLowerCase().substring(2)
                    el.removeEventListener(methodKey,oldProps[k])
                }else{
                    el.removeAttribute(k)
                }             
            }
        }
        for(var k in newProps){
            if(oldProps[k] !== newProps[k]){
                if(k.startsWith('on')){
                    var methodKey = k.toLowerCase().substring(2)
                    el.addEventListener(methodKey,newProps[k])
                }else{
                    el.setAttribute(k,newProps[k])
                }
            }
        }
        const oldChildren = n1.children
        const newChildren = n2.children
        if(typeof newChildren === 'string'){
            el.innerHTML = newChildren
        }else{//5 - 3 = 2 
            const commonArr = Math.min(oldChildren.length,newChildren.length)
            for(var i = 0; i < commonArr ; i++){
                patch(oldChildren[i],newChildren[i])
            }
            if(oldChildren.length > newChildren.length){
                oldChildren.slice(commonArr).forEach(item => {

                    el.removeChild(item.el)
                })              
            }
            if(oldChildren.length < newChildren.length){
                newChildren.slice(commonArr).forEach(item => {
                    mount(item,el)
                })                
            }
        }
    }
}