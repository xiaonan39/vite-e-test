<template>
  <div class="AI-engine">
    <search-dialog
      :searchForm="searchForm"
      title=""
      @refreshData="fetchAIEngine"
    />

    <div class="AI-engine-table">
      <div class="user-list-btn main-top-btn">
        <div class="user-btn-left">
          <el-button @click="createAIEngine()" type="primary">
            新增AI引擎
          </el-button>
        </div>
      </div>
      <el-table
        :data="AIEngineList"
        stripe
        style="width: 100%"
        :header-cell-style="{background: '#F9F9F9', height: '60px'}"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column
            property="userid"
            label="用户ID">
            <template #default="scope">
              {{ scope.row.userid || '—'}}
            </template>
          </el-table-column>
          <el-table-column
            property="engine_name"
            label="AI引擎名称">
            <template #default="scope">
              {{ scope.row.engine_name || '—'}}
            </template>
          </el-table-column>
          <el-table-column
            property="directory"
            label="算法路径">
            <template #default="scope">
              {{ scope.row.directory || '—'}}
            </template>
          </el-table-column>
          <el-table-column
            property="execute"
            label="算法执行指令">
            <template #default="scope">
              {{ scope.row.execute || '—'}}
            </template>
          </el-table-column>
          <el-table-column
            property="params"
            label="自由参数定制">
            <template #default="scope">
              <template v-if="scope.row.params?.length">
                <p v-for="item in scope.row.params">
                  {{ item }}
                </p>
              </template>
              <template v-else>
                —
              </template>
            </template>
          </el-table-column>
          <el-table-column
            property="operation"
            label="操作">
            <template #default="scope">
              <el-button type="text"
                @click="editAIEngine(scope.row)">
                <el-icon size="18px"><edit /></el-icon>
              </el-button>
              <el-button type="text"
                @click="deleteAIEngine(scope.row)">
                <el-icon color="red" size="18px"><delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
      </el-table>

      <create-dialog
        ref="createRef"
        title="创建AI引擎"
        @refreshTable="fetchAIEngine"
      />

      <edit-dialog 
        ref="editRef"
        @refreshTable="fetchAIEngine"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import searchDialog from '@/components/search/index.vue'
import createDialog from './dialog/createEditAI'
import editDialog from './dialog/createEditAI'
import { ElMessageBox } from 'element-plus'
import API from 'API'

// 传递给搜索框的数据
const searchForm = reactive({
  engine_name: {
    label: 'AI引擎',
    component: 'el-input',
    attrs: {
      placeholder: ' '
    },
    event: {}
  }
})

const createRef = ref(null)
const createAIEngine = () => {
  createRef.value.dialogShow()
}

const editRef = ref(null)
const editAIEngine = (val) => {
  editRef.value.dialogShow(Object.assign({}, val))
}

const deleteAIEngine = (val) => {
  ElMessageBox.confirm(
      '是否删除该AI引擎？',
      '删除AI引擎',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        showCancelButton: true,
        closeOnClickModal: false,
      }
    )
      .then(() => {
        API.AIEngine.deleteAIEngine({ ai_id: val.ai_id })
          .then((res) => {
            fetchAIEngine()
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  
}

const AIEngineList = ref([])
const fetchAIEngine = (val) => {
  API.AIEngine.getAIEngine(val)
    .then((res) => {
      AIEngineList.value = res
    })
    .catch((err) => {
      console.log(err)
    })
}

onMounted(() => {
  fetchAIEngine()
})
</script>

<style lang="scss" scoped>
@import "~style/basic.scss";
.AI-engines {

}

</style>