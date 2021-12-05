function createApp(rootComponent,componentProps){
    const app = {
        _props:componentProps,
        _rootCom:rootComponent,
        _container:null,
        mount(container){
            app._container = container
            let vnode = createVNode(rootComponent,componentProps)
            render(vnode,container)
        }
    }
    return app
}