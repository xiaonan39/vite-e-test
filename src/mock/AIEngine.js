import Mock from 'mockjs'
import HttpData from './baseData'
import AIEngine from '../api/AIEngine'

const AIEngineList = Mock.mock([
  {
    params: [],
    engine_name: '名称1',
    directory: '路径1cd/python/XXX',
    execute: '算法指令1python XXX.PY',
    userid: 1,
    ai_id: 1,
  },
  {
    params: ['自由参数1', '自由参数2'],
    engine_name: '名称2',
    directory: '路径2cd/python/XXX',
    execute: '算法指令2python XXX.PY',
    userid: 2,
    ai_id: 2,
  },
  {
    params: ['自由参数1', '自由参数2', '自由参数3'],
    engine_name: '名称3',
    directory: '路径3cd/python/XXX',
    execute: '算法指令3python XXX.PY',
    userid: 3,
    ai_id: 3,
  }
])

let data = AIEngineList

let singleAIEngine = Mock.mock({
  params: '自由参数1',
  engine_name: '名称1',
  online_status: 1,
  directory: '路径1cd/python/XXX',
  execute: '算法指令1python XXX.PY',
  userid: 3,
})

export default [
  { // 获取
    url: `/mock/${AIEngine.getAIEngine.url}`,
    method: 'post',
    response: req => {
      console.log(req.body)
      if (!Object.keys(req.body).length) {
        return new HttpData(data)
      } else {
        const searchData = data.filter(item => item.engine_name.indexOf(req.body.engine_name) !== -1)
        return new HttpData(searchData)
      }
    }
  },
  { // 添加
    url: `/mock/${AIEngine.createAIEngine.url}`,
    method: 'post',
    response: req => {
      console.log(req.body)
      data.push({
        engine_name: req.body.engine_name,
        directory: req.body.directory,
        execute: req.body.execute,
        params: req.body.params,
        userid: Math.ceil(Math.random()*30)
      })
      return new HttpData(data)
    }
  },
  /* { // 获取单一
    url: `/local/${AIEngine.singleAIEngine.url}`,
    method: 'post',
    response: req => {
      const filterData = data.filter(item => {
        // if (item.userid === req.body) return item
        return item.userid === req.body
      })
      console.log(filterData[0])
      return new HttpData(filterData[0])
    }
  }, */
  { // 编辑
    url: `/mock/${AIEngine.editAIEngine.url}`,
    method: 'post',
    response: req => {
      if (req.body.ai_id) {
        data.forEach(item => {
          if (item.ai_id === req.body.ai_id) {
            Object.keys(item).filter(child => {
              Object.keys(req.body).some(() => item[child] =req.body[child])
            })
          }
        })
      }
      return new HttpData({})
    }
  },
  { // 删除
    url: `/mock/${AIEngine.deleteAIEngine.url}`,
    method: 'post',
    response: req => {
      const deleteData = data.filter((item) => item.ai_id !== req.body.ai_id)
      data = deleteData
      return new HttpData({})
    }
  }
]