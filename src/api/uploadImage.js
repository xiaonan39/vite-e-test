export default {
  // 上传图像
  fetchImageInfo: {
    url: 'verify', // 默认post
    method: 'post'
  },
  // 分片上传
  shardToUpload: {
    url: 'merge',
    method: 'post'
  },
  init: {
    url: 'init',
    method: 'post'
  }
}
