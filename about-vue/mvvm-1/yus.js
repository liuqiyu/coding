class Yus {
  constructor(opt = {}) {
    this.opt = opt
    this.observe(opt.data)
    let root = document.querySelector(opt.el)
    this.root = root
    this.compile(root)
  }

  observe (data) {
    Object.keys(data).forEach(key => {
      let obv = new Observer()
      data['_' + key] = data[key]
      console.log(key)
      Object.defineProperty(data, key, {
        get () {
          Observer.target && obv.addSubNode(Observer.target);
          return data['_' + key]
        },
        set (newValue) {
          obv.update(newValue)
          data['_' + key] = newValue
        }
      })
    })
  }

  // 初始化页面，遍历 DOM，收集每一个key变化时，随之调整的位置，以观察者方法存放起来    
  compile (node) {
    [].forEach.call(node.childNodes, child => {
      if (!child.firstElementChild && /\{\{(.*)\}\}/.test(child.innerHTML)) {
        let key = RegExp.$1.trim()
        child.innerHTML = child.innerHTML.replace(new RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'gm'), this.opt.data[key])
        Observer.target = child
        this.opt.data[key]
        Observer.target = null
      }
      else if (child.firstElementChild)
        this.compile(child)
    })
  }
}


// 常规观察者类
class Observer {
  constructor() {
    this.subNode = []
  }
  addSubNode (node) {
    this.subNode.push(node)
    console.log(this.subNode)
  }
  update (newVal) {
    this.subNode.forEach(node => {
      console.log(node)
      node.innerHTML = newVal
    })
  }
}