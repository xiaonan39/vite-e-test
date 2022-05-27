import axios from 'axios'
import router from '../router'
import API from 'API'
import { ElMessage } from 'element-plus'

const service = axios.create({
  timeout: 15000
  // baseURL:'',
  // responseType: "json"
  // 携带cookie凭证
  // withCredentials: true
})

// 统一处理request
service.interceptors.request.use(config => {
  // object可以配置Content-Type
  if (config['Content-Type']) {
    config.headers['Content-Type'] = config['Content-Type']
  }
  if (window.localStorage.getItem('access_token')) {
    config.headers.common['token'] = window.localStorage.getItem('access_token')
  }
  if (config.method == 'post' && !config.data) {
    config.data = {}
  }
  return config
})
// 消息不重复弹出设置
const messageObj = {}
function showmessage (type, msg, time = 3) {
  if (!messageObj[msg] || messageObj[msg] !== type) {
    ElMessage({
      message: msg,
      type: type
    })
    messageObj[msg] = type
    setTimeout(() => {
      delete messageObj[msg]
    }, time * 1000)
  }
}

// 超时码设置
const statusCodeList = [401]
// 设置loading
// let loading

service.interceptors.response.use(
  response => {
    const { status, data } = response

    const currentPath = router.currentRoute.value.fullPath
    // get/post 请求下载文件导出
    if (response.config.responseType === 'blob') {
      if (status === 200) {
        if (typeof window.chrome !== 'undefined') {
          return { data: window.URL.createObjectURL(response.data) }
        }
      }
    }
    if (status === 200 && data.code === 200) {
      return data
    } else {
      showmessage('error', data.msg || '接口响应异常')
      // 如果超时
      if (statusCodeList.includes(data.code)) {
        // 如果退出
        setTimeout(function () {
          window.localStorage.clear()
          router.push({ path: '/login', query: { redirect: currentPath } })
        }, 2000)
      }
      return Promise.reject(new Error('response data necessary is valid'))
    }
  },
  err => {
    showmessage('error', err)
    return Promise.reject(err)
  }
)

export class request {
  /*
   * api url 转换
   * */
  static transformUrl (url, data, type) {
    if (
      data &&
      typeof data !== 'string' &&
      !Array.isArray(data) &&
      Object.keys(data).length
    ) {
      let newUrl = url
      const newData = Object.assign({}, data)

      Object.keys(data).forEach(k => {
        const reg = new RegExp(`{${k}}`, 'g')
        newUrl = newUrl.replace(reg, data[k])

        if (reg.test(url)) {
          newData[k] = undefined
        }
      })

      if (type === 'params') {
        return newData
      } else {
        return newUrl
      }
    } else {
      if (type === 'params') {
        return data
      } else {
        return url
      }
    }
  }

  static sendRequest (url, baseUrl, method = 'post', requestConfig) {
    const transUrl = baseUrl.replace(/^\//g, '')
    return function (params = {}, urlPath = '') {
      const type = method.toLowerCase() === 'get' ? 'params' : 'data'
      let realUrl = url
      if (urlPath) {
        if (realUrl.endsWith('/')) realUrl = `${realUrl}${urlPath}/`
        else realUrl = `${realUrl}/${urlPath}/`
      }
      const basic = {
        method,
        baseURL: transUrl,
        url: request.transformUrl(realUrl, params),
        [type]: request.transformUrl(url, params, 'params')
      }
      const allConfig = Object.assign({}, basic, requestConfig || {})
      // return request(allConfig)
      return new Promise((resolve, reject) => {
        service(allConfig)
          .then(json => {
            resolve(json.data)
          })
          .catch(json => {
            reject(json)
          })
          .finally(() => {})
      })
    }
  }

  static getRequest (apiContent, prefixUrl = '/') {
    const apiList = Object.keys(apiContent)
    const requests = {}
    apiList.forEach(k => {
      const { url, baseUrl, method, config } = apiContent[k]
      const baseURL = baseUrl || prefixUrl
      // console.log('url:' + url, '--baseURL:' + baseURL)
      requests[k] = this.sendRequest(url, baseURL, method, config)
    })
    return requests
  }
}
