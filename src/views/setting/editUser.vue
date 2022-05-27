<template>
  <div class="edit-user popup">
    <el-dialog
      v-model="isDialogAddVisible"
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
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="department"
          class="inline-form-item inline-left"
        >
          <el-select v-model="form.department"
            placeholder="请选择部门"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色分配"
          prop="role_id"
          class="inline-form-item"
        >
          <el-select v-model="form.role_id"
            placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显卡数量"
          prop="num"
        >
          <el-input-number
            v-model="form.num" :min="1"
          />
        </el-form-item>
        <el-form-item label="账户状态"
          prop="account_status"
        >
          <el-switch
            v-model="form.account_status"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="初始密码"
          prop="password"
          v-if="!currentUserName"
        >
          <el-input v-model="form.password"
            disabled></el-input>
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
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import API from 'API'

defineProps({
  title: {
    type: String,
    default: () => '用户修改'
  },
  roleList: Array,
  departmentList: Array
})
const isDialogAddVisible = ref(false)

const form = reactive({
  id: null,
  username: '',
  department: '',
  role_id: '',
  num: 1,
  account_status: true,
  password: '123456'
})
const validateName = (rule, value, callback) => {
  const title= /^[0-9\a-\z\A-\Z]{3,15}$/
  if (!title.test(value)) {
    callback(new Error('请输入长度3-15的英文和(或)数字'))
  } else {
    callback()
  }
}
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur'},
    { required: true, validator: validateName }
  ],
  role_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'blur' }],
  num: [{ required: true, message: '请输入显卡数量', trigger: 'blur' }]
})

const currentUserName = ref(null)
const dialogShow = (val) => {
  if (val) {
    currentUserName.value = val
    fetchSingleUser()
  }
  isDialogAddVisible.value = true
}
const fetchSingleUser = () => {
  if (!currentUserName.value) return
  API.user.getSingleUser({ username: currentUserName.value })
    .then((res) => {
      Object.keys(form).forEach((item) => {
        form[item] = res[item]
        if(item==='account_status')
            form.account_status=res.account_status?false:true
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const emit = defineEmits(['refreshTable'])
const formRef = ref(null)
const save = (val) => {
  formRef.value.validate((valid) => {
    if (valid) {
      form.account_status=form.account_status?0:1
      if (currentUserName.value) { // 编辑模式
        delete form.password
        API.user.editUser(form)
          .then((res) => {
            emit('refreshTable')
            dialogClose(false)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        delete form.id
        API.user.addUser(form)
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

const dialogClose = (data) => {
  isDialogAddVisible.value = false
  Object.keys(form).forEach((item) => {
    if (item !== 'num') form[item] = ''
  })
  form.num = 0
}

onMounted(() => {
  // fetchSingleUser()
})

defineExpose({
  dialogShow,
  dialogClose
})

</script>

<style lang="scss" scoped>
@import "~style/basic.scss";

.edit-user {
  :deep(.el-dialog) {
    .inline-left {
      float: left;
      margin-right: 20px;
    }
    .inline-form-item {
      width: 48%;
      .el-form-item__content {
        width: 150px;
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
  
}

</style>