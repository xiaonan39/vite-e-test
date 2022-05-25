<template>
  <div class="search-module">
    <div class="title-heading" v-if="props.title">
      <span>{{ props.title }}</span>
    </div>
    <!-- 搜索 -->
    <el-form
      class="search-block"
      ref="searchFormRef"
      :model="formModel"
      :inline="props.inline"
    >
      <el-row>
        <el-form-item
          v-for="(item, key) in props.searchForm"
          :key="key"
          :label="item.label"
          :prop="key"
          :class="item.class"
        >
          <template
            v-if="item.component === 'el-date-picker' && item.customContent"
          >
            <el-date-picker
              v-bind="item.attrs"
              v-model="formModel[key]"
              :style="item.style || 'width:258px'"
              clearable
              :editable="false"
              :type="item.type || ''"
              :prefix-icon="item.customPrefix ? customPrefix : ''"
            >
            </el-date-picker>
          </template>
          <component
            :is="item.component"
            v-bind="item.attrs"
            v-on="item.event"
            v-model="formModel[key]"
            :id="item.id"
            clearable
            v-if="!item.customContent"
            :style="item.style || 'width:200px'"
            :prefix-icon="item.customPrefix ? customPrefix : ''"
            :teleported="false"
          >
            <template #default v-if="item.component === 'el-select'">
              <el-option
                v-for="option in item.options"
                :key="option.label||option.key"
                :value="option.value||option.key"
                :label="option.label||option.value"
              >
              </el-option>
            </template>
          </component>
        </el-form-item>
        <div class="search-btn">
          <el-button type="primary" @click="searchSubmit('searchFormRef')">
            <!-- <el-icon><search /></el-icon> -->
            搜索
          </el-button>
          <el-button type="info" @click="resetSubmit('searchFormRef')">
            <!-- <el-icon><refresh /></el-icon> -->
            重置
          </el-button>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { shallowRef, h, ref, onBeforeMount } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
// shallowRef, h, watch,toRefs
const props = defineProps({
  title: { type: String, default: '搜索' },
  searchForm: { type: Object },
  inline: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})
const formModel = ref({})
onBeforeMount(() => {
  const keys = Object.keys(props.searchForm)
  const obj = {}
  keys.forEach(key => {
    obj[key] = props.searchForm[key].defaultValue || ''
  })
  formModel.value = Object.assign({}, formModel.value, obj)
})
const searchFormRef = ref(null)

const emit = defineEmits(['refreshData'])

// 日期自定义样式
const customPrefix = shallowRef({
  render () {
    return h('p', { class: 'icon-rili-01 font_family icon-size' })
  }
})

const searchSubmit = () => {
  for(let key in formModel.value) {
    if (formModel.value[key] === '') {
      delete formModel.value[key]
    }
  }
  emit('refreshData', Object.assign({}, formModel.value))
}
const resetSubmit = () => {
  searchFormRef.value.clearValidate()
  searchFormRef.value.resetFields()
  emit('refreshData', null)
}
</script>

<style lang="scss" scoped>
@import "~style/basic.scss";
@import "~style/common.scss";
.search-module {
  display: flex;
  height: 90px;
  flex-direction: column;
  border-bottom: 1px solid #ccc;
  .title-heading {
    font-size: 20px;
    color: #333333;
    font-weight: 500;
    height: 50%;
    line-height: 3.5;
    // ::before {
    vertical-align: middle;
    // }
  }
  :deep(.el-form-item) {
    margin-bottom: unset;
    margin-right: 20px;
    height: 55px;
    .el-range-separator {
      line-height: 1.5;
    }
  }
  .date-del-margin {
    margin-right: 0px;
  }
  :deep(.el-form-item__label) {
    line-height: 55px;
  }

  .date-dash {
    :deep(.el-form-item__label) {
      padding: 0 4px;
    }
  }
  .search-block {
    display: flex;
    margin: auto 0;
    :deep(.el-input__inner) {
      height: 30px;
    }
    .search-time {
      :deep(.el-input) {
        width: 158px;
      }
    }
    :deep(.el-input__prefix) {
      right: 5px;
      // left: unset;
    }
    .search-btn {
      height: 100%;
      line-height: 55px;
      .el-button+.el-button {
        margin-left: 20px;
      }
      .btn-reset {
        background: #99ACD4;
      }
      button {
        min-height: unset;
        // height: 26px;
        min-width: 62px;
        padding: 0px;
      }
    }
  }
  .el-select-dropdown__item {
    padding: 5px 10px;
    line-height: inherit;
  }
}
</style>
