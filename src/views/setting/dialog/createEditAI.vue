<template>
  <div class="AI-engine popup">
    <el-dialog
      v-model="isDialogVisible"
      :destroy-on-close="true"
      @close="dialogClose"
      :close-on-click-modal="false"
      :append-to-body="false"
    >
      <template #title>
        <div class="title">
          <!-- <span class="title-block"></span> -->
          <span class="title-texts">{{ title }}</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="算法名称" prop="engine_name">
          <el-input v-model="form.engine_name"></el-input>
        </el-form-item>
        <el-form-item label="算法路径" prop="directory">
          <el-input v-model="form.directory" placeholder="输入格式示例：cd/python/XXX"></el-input>
        </el-form-item>
        <el-form-item label="算法执行指令" prop="execute">
          <el-input v-model="form.execute" placeholder="输入格式示例：python XXX.PY"></el-input>
        </el-form-item>
        <el-form-item
          label="自由参数定制"
          class="free-param"
          prop="params"
        >
          <!-- v-for="item in form.params" -->
          <div class="free-param-one">
            <el-input v-model="form.params[0]"></el-input>
            <span @click="addFreeParam">
                <el-icon size="20px"><Plus /></el-icon>
            </span>
          </div>
          <template v-if="form.params.length > 1">
            <div
              class="free-param-one"
              v-for="(item, index) in form.params.length - 1"
            >
              <el-input v-model="form.params[index+1]">
              </el-input>
              <span @click="minusFreeParam(index+1)">
                <el-icon><Minus /></el-icon>
              </span>
            </div>
          </template>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogClose(false, 'formRef')">取消</el-button>
          <el-button
            type="primary"
            class="btn-default-blue"
            @click="save('formRef')"
          >
            {{ isEditDialog ? '确定' : '创建' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref, reactive, defineExpose, defineEmits } from 'vue'
import API from 'API'

defineProps({
  title: {
    type: String,
    default: () => '修改AI引擎'
  }
})

const isEditDialog = ref(true)
const isDialogVisible = ref(false)
const dialogShow = (val) => {
  isDialogVisible.value = true
  if (!val) {
    isEditDialog.value = false
    return
  }
  fetchSingleAIEnging(JSON.parse(JSON.stringify(val)))
}
const fetchSingleAIEnging = (val) => {
  Object.keys(form).forEach((item) => {
    form[item] = val[item]
  })
  console.log(val)
}

const dialogClose = () => {
  isDialogVisible.value = false
  Object.keys(form).forEach((item) => {
    if (item !== 'params') form[item] = ''
    else form.params = []
  })
}

const form = reactive({
  ai_id: '',
  engine_name: '',
  directory: '',
  execute: '',
  params: []
})
const validateName = (rule, value, callback) => {
  const title= /^[0-9\a-\z\A-\Z]|["',，.。/、\]\[【】\\n\s！!?？——_<>%;‘’；)《（）》(&+=`“”·*#@@]/
  const zh = /[\u4e00-\u9fa5]$/
  const data = value.every((item) => {
    if (item.trim() === '') return true
    if (item.length > 1000) {
      callback(new Error('长度不超过1000'))
    }
    else if (!title.test(item) || zh.test(item)) {
      callback(new Error('仅支持输入英文、标点符号、数字'))
    } else {
      return true
    }
  })
  if (data) callback()
}
const rules = reactive({
  engine_name: [
    { required: true, message: '请输入AI引擎名称', trigger: 'blur'},
    { max: 1000, message: '长度不超过1000', trigger: 'blur' }
  ],
  directory: [
    { required: true, message: '请输入算法路径', trigger: 'blur' },
    { max: 1000, message: '长度不超过1000', trigger: 'blur' }
  ],
  execute: [
    { required: true, message: '请输入算法执行指令', trigger: 'blur' },
    { max: 1000, message: '长度不超过1000', trigger: 'blur' }
  ],
  params: [
    { required: false, message: '仅支持输入英文、标点符号、数字', trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ]
})

const addFreeParam = (val) => {
  // 若有空值，则不允许再次添加输入框
  let flag = true
  form.params.forEach((item) => {
    if (!item.trim()) flag = false
  }) 
  if (!flag) return
  form.params.push('')
}
const minusFreeParam = (index) => {
  form.params.splice(index, 1)
}

const emit = defineEmits(['refreshTable'])
const formRef = ref(null)
const save = (val) => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 过滤掉空字符串
      const validArr = form.params.filter((item) => {return item.trim()})
      form.params = validArr
      if (isEditDialog.value) { // 编辑模式
        API.AIEngine.editAIEngine(form)
          .then((res) => {
            emit('refreshTable')
            dialogClose(false)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        API.AIEngine.createAIEngine(form)
          .then(res => {
            emit('refreshTable')
            dialogClose(false)
          })
      }
    } else {
      return false
    }
  })
}

defineExpose({
  dialogShow,
  dialogClose
})


</script>

<style scoped lang="scss">
@import "~style/basic.scss";

.AI-engine {
  :deep(.el-dialog) {
    max-height: 35em;
    overflow-y: auto;
  }
  :deep(.el-form) {
    .free-param {
      .el-form-item__content {
        .free-param-one {
          display: flex;
          width: 100%;
        }
        .free-param-one+.free-param-one {
          margin-top: 10px;
        }
        .el-icon {
          font-size: 22px;
          margin-left: 5px;
          height: 100%;
          cursor: pointer;
        }
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: end;
    button:first-child {
      margin-right: 20px;
    }
  }
}


</style>