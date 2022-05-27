// import mitt from 'mitt'
// export const emitter = mitt()
// 下载文件
export const clickDownUrl = function (fileName, url, k) {
  const id = k || 'aiddownloadcomplete'
  const a = document.createElement('a')
  a.setAttribute('download', fileName)
  a.setAttribute('href', url)
  a.setAttribute('id', id)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById(id))
}
// 深拷贝
export const cloneDeep = (target, hash = new WeakMap()) => {
  // 对于传入参数处理
  if (typeof target !== 'object' || target === null) {
    return target
  }
  // 哈希表中存在直接返回
  if (hash.has(target)) return hash.get(target)

  const cloneTarget = Array.isArray(target) ? [] : {}
  hash.set(target, cloneTarget)

  // 针对Symbol属性
  const symKeys = Object.getOwnPropertySymbols(target)
  if (symKeys.length) {
    symKeys.forEach(symKey => {
      if (typeof target[symKey] === 'object' && target[symKey] !== null) {
        cloneTarget[symKey] = cloneDeep(target[symKey])
      } else {
        cloneTarget[symKey] = target[symKey]
      }
    })
  }

  for (const i in target) {
    if (Object.prototype.hasOwnProperty.call(target, i)) {
      cloneTarget[i] =
        typeof target[i] === 'object' && target[i] !== null
          ? cloneDeep(target[i], hash)
          : target[i]
    }
  }
  return cloneTarget
}

/*
 * 通过所有层级数据组合成树结构数据
 * */
export const getTreeData = function (data, parentCode, categoryCode) {
  const run = function (data) {
    for (let i = 0; i < data.length; i++) {
      const cur = data[i]
      for (let j = 0; j < data.length; j++) {
        const after = data[j]

        if (cur[parentCode] === after[categoryCode]) {
          if (after.children) {
            after.children.push(cur)
          } else {
            after.children = [cur]
          }
          data.splice(i, 1)
          i--
        } else {
          if (after.children) {
            const result = runr(data, i, cur, after.children)
            if (result) {
              data.splice(i, 1)
              i--
            }
          }
        }
      }
    }
  }
  const runr = function (data, i, cur, list) {
    const result = list.find(item => {
      if (cur[parentCode] === item[categoryCode]) {
        if (item.children) {
          item.children.push(cur)
        } else {
          item.children = [cur]
        }
        return true
      } else if (item.children) {
        runr(data, i, cur, item.children)
      } else {
        return false
      }
    })
    return result
  }
  run(data)
}

export const floatObj = (function () {
  /*
   * 判断obj是否为一个整数
   */
  function isInteger (obj) {
    return Math.floor(obj) === obj
  }

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  function toInteger (floatNum) {
    var ret = { times: 1, num: 0 }
    if (isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    var strfi = floatNum + ''
    var dotPos = strfi.indexOf('.')
    var len = strfi.substr(dotPos + 1).length
    var times = Math.pow(10, len)
    var intNum = parseInt(floatNum * times + 0.5, 10)
    ret.times = times
    ret.num = intNum
    return ret
  }

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  function operation (a, b, op) {
    var o1 = toInteger(a)
    var o2 = toInteger(b)
    var n1 = o1.num
    var n2 = o2.num
    var t1 = o1.times
    var t2 = o2.times
    var max = t1 > t2 ? t1 : t2
    var result = null
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max
      case 'multiply':
        result = (n1 * n2) / (t1 * t2)
        return result
      case 'divide':
        result = (n1 / n2) * (t2 / t1)
        return result
    }
  }

  // 加减乘除的四个接口
  function add (a, b) {
    return operation(a, b, 'add')
  }

  function subtract (a, b) {
    return operation(a, b, 'subtract')
  }

  function multiply (a, b) {
    return operation(a, b, 'multiply')
  }

  function divide (a, b) {
    return operation(a, b, 'divide')
  }

  // exports
  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide
  }
})()

/**
 * 树 转 列表
 * 广度优先，先进先出
 * @param {Array} tree 树状数据
 * @param {String} childKey children的key
 */
export function treeToList (tree, childKey = 'children') {
  const stack = tree.concat([])
  const data = []
  while (stack.length !== 0) {
    // 从stack中拿出来分析
    const shift = stack.shift() // stack.pop()  先进后出
    data.push(shift)
    const children = shift[childKey]
    if (children) {
      for (let i = 0; i < children.length; i++) {
        // 把数据放入stack中
        stack.push(children[i])
      }
    }
  }
  return data
}

export function filterRoutes (routes = [], newRoutes = [], parentPath = '') {
  routes.forEach(route => {
    let obj = {}
    parentPath = parentPath === '/' ? '' : parentPath
    const path = route.path.startsWith('/') ? route.path : `/${route.path}`
    if (route.meta && route.meta.isMenuElement) {
      obj = {
        ...route.meta,
        menuName: route.meta.title,
        url: `${parentPath}${path}`
      }
      newRoutes.push(obj)
    }
    if (route.children) {
      // if (route.meta && route.meta.icon) {
      //   obj.children = []
      // }
      return filterRoutes(
        route.children,
        obj.children || newRoutes,
        `${parentPath}${path}`
      )
    }
  })
  return newRoutes
}
// 公共的下拉value label属性
export function optionsTransform (data) {
  if (!data) return
  // 定义公共的 value key
  const list = ['value', 'key']
  const newArr = []
  // 遍历获取的数据
  data.map(item => {
    const newObj = {}
    for (let i = 0; i < list.length; i++) {
      newObj[list[i]] = item[Object.keys(item)[i]]
    }
    newArr.push(newObj)
  })
  return newArr
}
// 下拉框数据转为需要的key/value
export function optionsToValue (data) {
  if (!data) return
  // 定义公共的 value key
  const list = ['key', 'value']
  const newArr = []
  // 遍历获取的数据
  data.map(item => {
    const newObj = {}
    for (let i = 0; i < list.length; i++) {
      newObj[list[i]] = item[Object.keys(item)[i]]
    }
    newArr.push(newObj)
  })
  return newArr
}
// 时间转换
export function transDate (n) {
  const date = new Date(n)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  const H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  const F = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  const S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return (Y + M + D + H + F + S)
}

export function transUrl2Json (url) {
  const json = {
    path: '',
    param: {}
  }
  if (!url) return json
  const index = url.indexOf('?')
  if (index === -1) {
    json.path = url
    return json
  }
  json.path = url.substr(0, index)
  const paramUrl = url.substr(index + 1) || ''
  const params = paramUrl.split('&') || []
  for (const str of params) {
    if (!str) continue
    const arr = str.split('=')
    json.param[arr[0]] = arr[1] || ''
  }
  return json
}
