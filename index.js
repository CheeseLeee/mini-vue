function createApp(rootComponent){
    processComponent(rootComponent)
 
    
    let proxy = rootComponent._instance.proxy
    //ctx.count = 1  ==> count = 2
    return {
        mount(selector){
            var container = document.querySelector(selector)
            let isMounted = false
            let oldVnode = null
            effect(() => {
                if(!isMounted){
                    oldVnode = rootComponent.render(proxy)
                    mount(oldVnode,container)
                    isMounted = true
                }else{
                    const newVnode = rootComponent.render(proxy)
                    patch(oldVnode,newVnode)
                    oldVnode = newVnode
                }
            })
        }
    }
}

function processComponent(rootComponent){
    let instance = {
        props:{},
        attrs:{},
        setupState:null,
        proxy:null
    }
    let setupResult = rootComponent.setup()
    if(isObject(setupResult)){
        instance.setupState = setupResult
    }
    let handler = {
        get(target,key,reciver){
            if(target.setupState[key]){
                return Reflect.get(target.setupState,key)  
            }else{
                return Reflect.get(target.props,key)
            }           
        },
        set(target,key,value,recier){
            if(target.setupState[key]){
                return Reflect.set(target.setupState,key,value)
            }else{
                console.warn('err');
            }
        } 
    }
    instance.proxy = new Proxy(instance,handler)
    rootComponent._instance = instance
}