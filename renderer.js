function render(vnode,container){
    patch(null,vnode,container)
}

function setupRenderEffect(instance){
    instance.render()
}
function createVNode(type,props,children){
    const shapeFlage = typeof type === 'string' ? '_isElement' : '_isComponent'
    const vNode = {
        _isVnode:true,
        el:null,
        type,
        props,
        children,
        shapeFlage,
        component:null
    }
    return vNode
}

function patch(n1,n2,container){
    let {shapeFlage} = n2
    if(shapeFlage === '_isElement'){
        console.log('_isElement')
    }else{
        console.log('_isComponent')
        processComponent(n1,n2,container)
    }
}
function processComponent(n1,n2,container){
    if(n1 === null){
        console.log('frist mount')
        mountComponent(n2,container)
    }else{

    }
}
function mountComponent(initialVNode,container){
    const instance = createComInstace(initialVNode)
    setupComponent(instance)
}

function createComInstace(vnode){
    const instance = {
        vnode,
        type:vnode.type,
        props:{},
        attrs:{},
        slot:{},
        setupState:{},
        isMounted:false
    }
    instance.ctx = {_:instance}
    return instance
}

function setupComponent(instance){
    debugger
    const {props,children} = instance.vnode
    instance.props = props
    instance.children = children
    
    const component = instance.type 
    let setupCtx = createCtx(instance)
    let {setup} = component
    if(setup){
        const setupResult = setup(instance.props,setupCtx)
        handleSetupResult(instance,setupResult)
        let handler = {
            get({_ : instance},key,reciver){
                const {setupState,props} = instance
                if(key in setupState){
                    return setupState[key]
                }else if(key in props){
                    return props[key]
                }
            },
            set({_ : instance},key,value,reciver){
                const {setupState,props} = instance
                Reflect.set(setupState,key,value)
            }
        }
        instance.proxy = new Proxy(instance.ctx,handler)
        component.render(instance.proxy)
    }else{
        finshSetupComponent(instance)
    }
}

function handleSetupResult(instance,setupResult){
    if(typeof setupResult === 'function'){
        instance.render = setupResult
    }else if(typeof setupResult === 'object'){
        instance.setupState = setupResult
    }
    finshSetupComponent(instance)
}

function finshSetupComponent(instance){
    let component = instance.type
    //let {render} = component
    if(!instance.render){
        //模版编译
    }
    instance.render = component.render
}

function createCtx(instance){
    return {
        attrs:instance.attrs,
        slot:instance.slot,
        emit:() => {}
    }
}