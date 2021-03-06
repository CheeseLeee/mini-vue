function createApp(rootComponent){
    let ctx = rootComponent.setup()
   
    //ctx.count = 1  ==> count = 2
    return {
        mount(selector){
            var container = document.querySelector(selector)
            let isMounted = false
            let oldVnode = null
            effect(() => {
                console.log(ctx)         
                if(!isMounted){
                    oldVnode = rootComponent.render(ctx)
                    mount(oldVnode,container)
                    isMounted = true
                }else{
                    const newVnode = rootComponent.render(ctx)
                    patch(oldVnode,newVnode)
                    oldVnode = newVnode
                }
            })

        }
    }
}