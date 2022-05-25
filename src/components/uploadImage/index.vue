<template>
  <div class="dialogClass" v-if="dialogUpload">
    <el-dialog
      v-model="dialogUpload"
      :destroy-on-close="true"
      custom-class="upload-image-card"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="false"
    >
      <div class="title">
        <span class="title-divider"></span>
        <span class="title-texts">{{ uploadTitle }}</span>
      </div>
      <div class="container">
        <div class="uploadImage">
            <!-- :show-file-list="false" -->
            <!-- :file-list="fileTableList" -->
          <el-upload
            action="#"
            :accept="uploadAccept"
            :on-change="handleChange"
            :auto-upload="false"
            :headers="headers"
            multiple
            ref="upload"
          >
            <el-button
              type="primary"
              class="upload-begin"
              @click="allUpload"
            >
              <!-- :disabled="continueFlag" -->
              上传
            </el-button>
            <template #trigger>
              <el-button
              type="primary"
              style=""
              class="restoreColor">
               <!-- :disabled="!continueAdd" -->
                添加{{ type }}
              </el-button>
            </template>

            <template #tip>
              <el-table
                :data="fileTableList"
                :row-class-name="tableRowClassName"
              >
                <el-table-column :label="type+'名称'" prop="name" align="left">
                  <template #default="scope">
                    {{ scope.row.file.name }}
                  </template>
                </el-table-column>
                <el-table-column :label="type+'大小'" prop="size" align="left">
                  <template #default="scope">
                    {{ format(scope.row.file.size) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="上传进度/状态"
                  prop="status"
                  align="left"
                >
                  <template #default="scope">
                    <div class="columnSize">
                      <span v-if="scope.row.status">
                        {{ scope.row }}
                        {{ uploadState(scope.row.status) }}
                      </span>
                      <span v-else>{{ uploadState(scope.row.status) }}</span>
                      <span
                        class="uploadfileFaild"
                        v-if="scope.row.uploadedFile"
                      >
                        上传{{type}}失败
                      </span>
                    </div>
                    <el-progress
                      v-if="scope.row.uploadedFile"
                      :status="scope.row.uploadedFile"
                      :percentage="scope.row.progress"
                    >
                    </el-progress>
                    <el-progress v-else :percentage="0"> </el-progress>
                  </template>
                </el-table-column>
                <el-table-column label="" width="120">
                  <template #default="scope">
                    <div class="operation">
                      <!-- 上传中可以暂停开始 -->
                      <template v-if="scope.row.uploadedFile===null">
                        <template v-if="scope.row.pause">
                          <span @click="handlePause(scope.row, scope.$index)">
                            <el-icon><VideoPause /></el-icon>
                          </span>
                        </template>
                        <template v-else>
                          <span @click="handlePlay(scope.row, scope.$index)">
                            <el-icon><VideoPlay /></el-icon>
                          </span>
                        </template>
                      </template>
                      <!-- 仅失败可以重传？ -->
                      <template v-else-if="scope.row.uploading==='false'">
                        <el-tooltip
                          content="重传"
                          placement="top-start"
                        >
                          <span @click="handleAgain(scope.row, scope.$index)">
                            <el-icon><Refresh /></el-icon>
                          </span>
                        </el-tooltip>
                      </template>
                      <span @click="handleDelete(scope.row, scope.$index)">
                        <el-icon><Close /></el-icon>
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-upload>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="uploadImage">
import { ElMessageBox } from 'element-plus'
import API from 'API'
import { ref, onMounted, reactive } from 'vue'
import SparkMD5 from 'spark-md5'
const chunkSize = 1024 * 1024 * 20
const dialogUpload = ref(false) // 控制面板显示
let fileTableList = reactive([]) // 上传需要的(原始文件数据)
const headers = ref({
  processData: false,
  contentType: false
})
// const continueFlag = ref(true) // 控制开始上传按钮的显示
// const uploadArray = ref([]) // 成功上传的图像信息
const emit = defineEmits(['getImageData'])
defineProps({
  uploadAccept: {
    // .svs, .ndpi
    type: String,
    default: () => ''
  },
  type: {
    type: String,
    default: () => '图像'
  },
  uploadTitle: {
    type: String,
    default: () => '上传图像'
  }
})

const show = (data) => {
  dialogUpload.value = true
}

const handleChange = (file, list) => {
  if (file.status !== 'ready') return
  fileTableList.push({
    file: file.raw,
    uploading: null, // 未上传的是null，上传中为true，无论上传成功或失败都是false(或者仅失败为false？)。
    progress: 0,
    pause: true, // true为上传中(可暂停)，false为暂停中(可上传)
    uploadedFile: null // 如果上传未完成，则为null;如果上传失败，则为false;如果上传成功，则为UploadedFile实例
  })
}
// 样式
const tableRowClassName = ({ rowIndex }) => {
  const index = rowIndex + 1
  if (index % 2 === 0) {
    return 'even-number'
  } else if (index % 2 === 1) {
    return 'odd-number'
  }
}
// 图像上传状态显示
const uploadState = (status) => {
  if (!status) return
  if (status === 'ready' || 0) {
    return '待上传'
  } else if (status === '') {
    return '待上传'
  } else if (status === 1) {
    return '上传中'
  } else if (status === 2) {
    return '已上传'
  } else if (status === 3) {
    return '已删除'
  } else if (status === 4) {
    return '文件错误'
  }
}
// 开始上传
const allUpload = async () => {
  fileTableList.forEach(async (item) => {
    console.log(item)
    singleUpload(item)
  })
}
const singleUpload = async (item) => {
  if(item.updating || item.uploadedFile !== null) return
  item.updating = true
  const { file } = item
  const fileName = file.name
  const totalChunk = Math.ceil(file.size / chunkSize)
  const md5 = await getFileMd5(file)
  const fileInfo = await createFileInfo(
    fileName,
    md5,
    totalChunk
  )
  const uploadFile = await doUploadFilePart(fileInfo, file)
}
// 获取MD5码
const getFileMd5 = (file) => {
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        const _md5 = spark.end()
        resolve(_md5)
      }
    }
    function loadNext () {
      const start = currentChunk * chunkSize
      const end = start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
  })
}
// 获取图像信息, 此步骤貌似可省略
const createFileInfo = async (fileName, md5, totalChunk, platform) => {
  const formData = new FormData()
  formData.append('file_name', fileName)
  formData.append('file_MD5', md5)
  formData.append('total_chunk', totalChunk)
  return new Promise(resolve => {
    API.uploadImage.fetchImageInfo(formData).then(data => {
      // 如果上传的table中存在重名的图像，则(为啥不能放table中呢？好像是不能重名的哈)
      /* const flag = fileTableList.value.some(item => {
        return item.file_name === data.file_name
      })
      if (flag) return
      fileTableList.value.push(data) */
      resolve(data)
    })
  })
}
// 循环切片上传
const doUploadFilePart = async (data, file) => {
  const infoTotalChunk = data.total_chunk
  const uploadArray = i => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      // let currentIndex = data.data.next_index
      const infoId = data.id

      const uid = file.uid
      const index = fileTableList.findIndex(item => item.file.uid === uid)
      let progress = ''

      const startIndex = i * chunkSize
      const endIndex = Math.min(file.size, startIndex + chunkSize)
      const bufFilePart = file.slice(startIndex, endIndex)

      formData.append('file_part', bufFilePart)
      formData.append('current_index', i)
      formData.append('id', infoId)

      // 关闭dialog时停止接下来的所有上传请求，兵清空table
      if (dialogUpload.value === false) {
        fileTableList = []
        return
      }
      API.uploadImage.shardToUpload(formData)
        .then(datas => {
          if (datas) {
            // currentIndex = datas.data.next_index
            // 设置进度条
            progress = Math.round(
              (datas.next_index / datas.total_chunk) * 100
            )
            fileTableList[index].file = datas
            fileTableList[index].progress = progress
            // 控制开始上传按钮的显示
            if (i === datas.total_chunk - 1) {
              fileTableList = fileTableList.filter(
                item => uid !== item.file.uid
              )
              // 获取公共图片信息参数
              if (datas) {
                emit('getImageData', datas)
              }
              resolve(datas)
            }
            resolve(datas)
          } else {
            if (!fileTableList[index]) {
              fileTableList[index].file = {}
            }
            fileTableList[index].uploadedFile = 'exception'
            fileTableList = fileTableList.filter(
              item => uid !== item.file.uid
            )
            resolve(datas)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  for (let i = 0; i < infoTotalChunk; i++) {
    const data = await uploadArray(i)
    if (i === infoTotalChunk - 1) {
      return data
    }
  }
}
// 暂停
const handlePause = (val, index) => {
  fileTableList[index].pause = false
}
// 开始
const handlePlay = (val, index) => {
  fileTableList[index].pause = true
}
// 删除待上传的图像
const handleDelete = (row, index) => {
  ElMessageBox({
    title: '', // MessageBox 标题
    message: '确认删除这个图像吗？', // MessageBox 消息正文内容
    confirmButtonText: '确定', // 确定按钮的文本内容
    cancelButtonText: '取消', // 取消按钮的文本内容
    showCancelButton: true, // 是否显示取消按钮
    closeOnClickModal: false, // 是否可通过点击遮罩关闭
    type: 'warning' // 消息类型，用于显示图标
  })
    .then(() => {
      fileTableList.splice(index, 1)
    })
    .catch(() => {
      console.log('已取消')
    })
}
// 关闭dialog
const handleClose = () => {
  let flag = fileTableList.some((item => {
    return item.uploading = false
  }))
  console.log(flag)
  if (flag) {
    dialogUpload.value = false
  } else {
    ElMessageBox.confirm('图片正在上传，是否退出', {
      confirmButtonText: '退出',
      cancelButtonText: '继续上传',
      type: 'warning'
    })
      .then(res => {
        fileTableList = []
        dialogUpload.value = false
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// 上传图像大小千位分隔MB
const format = (num) => {
  const size = (num / (1024 * 1024)).toFixed(2)
  const reg = /\d{1,3}(?=(\d{3})+$)/g
  return (size + '').replace(reg, '$&,') + 'MB'
}
onMounted(() => {
})

defineExpose({ // 可以被外部组件实例访问
  show,
  handleClose
})

</script>

<style lang="scss" scoped>
// @import '~style/common.scss';
// 禁用thead的下边框
:deep(.is-leaf) {
  border-bottom: 0px !important;
}
:deep(.el-dialog) {
  width: 1203px !important;
  margin-top: 15vh !important;
  .el-table__inner-wrapper::before {
    background-color: unset;
  }
}
:deep(.upload-image-card) {
  height: 604px !important;
  border-radius: 5px !important;
  .el-dialog__body {
    width: 1135px;
    margin: 0 auto;
    padding: 0;
    .el-table__cell {
      text-align: left;
      padding: 0;
    }
    .el-table__body-wrapper {
      overflow: overlay;
      height: 335px;
    }
  }
}

:deep(.el-icon) {
  font-size: 16px !important;
  color: #333333;
}
.title {
  height: 25px;
  position: absolute;
  top: 30px;
  display: flex;
  line-height: 18px;
}
.title-divider {
  display: block;
  width: 4px;
  height: 18px;
  background: #77b0fd;
}
.title-texts {
  padding-left: 2px;
  font-size: 16px;
  color: #333333;
}
.container {
  width: 100%;
  // height: 600px;
  display: flex;
  flex-direction: column;
}
.uploadImage {
  width: 100%;
  // height: 583px;
  margin-top: 20px;
  position: relative;
}
:deep(.el-upload--text) {
  position: absolute;
  right: 158px;
  button {
    width: 90px !important;
    height: 30px !important;
  }
}
:deep(.upload-begin) {
  width: 90px !important;
  height: 30px !important;
  float: right;
  margin-right: 49px;
  margin-bottom: 20px;
}
:deep(.upload-btn) {
  float: right;
}
// 更改表格的默认奇偶的背景颜色
:deep(.odd-number) {
  height: 60px !important;
}
:deep(.even-number) {
  background-color: #f9f9f9;
  height: 60px !important;
}
:deep(.el-upload-list) {
  display: none;
}
:deep(.close-btn) {
  font-size: 14px;
  color: #666666;
}
:deep(.columnSize) {
  font-size: 12px !important;
  .uploadfileFaild {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
}
:deep(.el-progress) {
  display: flex;
  flex-direction: row-reverse;

  .el-progress__text {
    font-size: 12px !important;
  }
}
:deep(.el-table__header-wrapper thead tr th:nth-child(2)){
  text-align: left;
}
// table header背景色
:deep(.el-table__header-wrapper tr){
  height: 60px;
}
:deep(.el-table__header-wrapper .cell){
  font-size: 14px;
  font-weight: 500;
  // padding: 0px 0 18px;
  color: #333333;
}

:deep(.el-table__cell) {
  text-align: center;
}
:deep(.el-table__body-wrapper .el-table__cell) {
  font-size: 14px;
  color: #666666;
}
:deep(.el-table__row td:nth-child(2)){
  text-align: left;
}
// 操作按钮
.operation {
  display: flex;
  justify-content: space-around;
  span {
    cursor: pointer;
  }
}

</style>
