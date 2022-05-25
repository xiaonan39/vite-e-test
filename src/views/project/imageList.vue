<template>
  <div class="btns">
    <el-button-group>
      <el-button :disabled="changeDisabled">
        <i class="el-icon-upload2 el-icon--left" size="mini"></i>选择文件
        <input
          v-if="!changeDisabled"
          type="file"
          class="select-file-input"
          accept=".ndpi"
          @change="handleFileChange"
        />
      </el-button>
      <el-button @click="handleUpload()"><i class="el-icon-upload el-icon--left" size="mini"></i>上传</el-button>
      <el-button @click="handlePause"><i class="el-icon-video-pause el-icon--left" size="mini"></i>暂停</el-button>
      <el-button @click="handleResume"><i class="el-icon-video-play el-icon--left" size="mini"></i>恢复</el-button>
      <el-button @click="clearFiles"><i class="el-icon-video-play el-icon--left" size="mini"></i>清空</el-button>
    </el-button-group>

    <div>
      <el-button @click="showUploadImage">自定义上传文件</el-button>
      <upload-image 
        ref="uploadImageRef"
        uploadAccept=".ndpi"
        uploadTitle="上传图像"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, reactive } from 'vue'
import uploadImage from '@/components/uploadImage/index.vue'


let data = reactive([])
const chunkSize = 10 * 1024 * 1024; // 切片大小
let fileIndex = 0; // 当前正在被遍历的文件下标
let container = reactive({ files: null })
const tempFilesArr = reactive([]) // 存储files信息
const cancels = reactive([]) // 存储要取消的请求
const tempThreads = ref(3)
// const status = Status.wait // 默认状态
const changeDisabled = ref(false)

// 获取文件
const handleFileChange = (e) => {
  /* 
    获取选中的文件
  */
  const files = e.target.files
  if (!files) return
  fileIndex = 0
  container.files = files
  // 判断文件选择的个数
  /* if( ) {

  } */
}
// 上传
const handleUpload = async (val) => {
  if (!container.files) return
  const fileChunkList = createFileChunk(container.files[0])
  data = fileChunkList.map(({ file }, index) => ({
    chunk: file,
    // 文件名+数组下标
    hash: container.files[0].name + '-' + index
  }))
  await uploadChunks()
}
// 切片
const createFileChunk = (file, size = chunkSize) => {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + size)})
    cur += size
  }
  return fileChunkList
}
// 上传切片
const uploadChunks = async () => {
  const requestList = data.map(({ chunk, hash}) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('hash', hash)
    formData.append('filename', container.file)
    return { formData }
  }).map(({ formData }) =>  request({url: "http://localhost:8888/", data: formData}))
  await Promise.all(requestList)
  // 合并切片请求
  // await mergeRequest()
}
const request = ({ url, method = "post", data, headers = {}, requestList }) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    Object.keys(headers).forEach(key => 
      xhr.setRequestHeader(key, headers[key])
    )
    xhr.send(data)
    xhr.onload = e => {
      resolve({
        data: e.target.response
      })
    }
  })
}
// 暂停
const handlePause = (val) => {

}
// 恢复
const handleResume = (val) => {

}
// 清空
const clearFiles = (val) => {

}

// 我是一条分割线---------------------------------------------------------
const uploadImageRef = ref(null)
const showUploadImage = () => {
  uploadImageRef.value.show()
}


</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  >div {
    flex: 1;
  }
}
</style>