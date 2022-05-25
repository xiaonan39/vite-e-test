export default {
  // 上传图像
  fetchImageInfo: {
    url: 'hephaestus/vulcan/new_create/', // 默认post
    method: 'post'
  },
  // 分片上传
  shardToUpload: {
    url: 'hephaestus/vulcan/new_upload_part/',
    method: 'post'
  }
}
