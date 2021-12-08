

const targetMap = new WeakMap() 
let activeEffect = null
function effect(eff){
    activeEffect = eff  
    activeEffect()
    activeEffect = null
}

//console.log(`total:${total};salePrice:${salePrice.value}`) //9,4.5
//var n = product.quantity

//console.log(`total:${total};salePrice:${salePrice.value}`) //13.5,4.5

//console.log(`total:${total};salePrice:${salePrice.value}`) //27,9 
function track(target,key){    
    
    if(activeEffect){
        let depsMap = targetMap.get(target)
        if(!depsMap){
            depsMap = new Map()
            targetMap.set(target,depsMap)
        }
        let dep = depsMap.get(key)
        if(!dep){
            dep = new Set()
            depsMap.set(key,dep)
        }
        dep.add(activeEffect)
        
    }

}
function trigger(target,key){
    let depsMap = targetMap.get(target)
    if(!depsMap){ return }
    let dep = depsMap.get(key)
    if(dep){
        
        dep.forEach(effect => effect())
    }
}
function reactive(target){
    const handler = {
        get(target,key,reciver){          
            let result = Reflect.get(target,key,reciver)
            track(target,key)
            return result
        },
        set(target,key,value,reciver){   
            if(target[key] !== value){
                var result = Reflect.set(target,key,value,reciver) //boolean
                trigger(target,key)
            }
            return result
        }
    }
    return new Proxy(target,handler)
}

function ref(raw){
    const r = {
        get value(){
            track(r,'value')
            return raw
        },
        set value(newValue){
            if(raw !== newValue){
                raw = newValue
                trigger(r,'value')
            }
        }
    }
    return r
}

function computed(getter){
    let result = ref()
    effect(() => {
        result.value = getter()
    })
    return result
}

let count = ref(0)

count.value = 10

