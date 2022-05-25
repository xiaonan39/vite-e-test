export default class HttpData {
  constructor (options) {
    this.code = options.code || 200
    this.msg = options.msg || ''
    this.data = options.data || options
    return JSON.stringify(this)
  } 
}