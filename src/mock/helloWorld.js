import Mock from 'mockjs'
import HttpData from './baseData'

// 获取用户列表
const userList = Mock.mock({
  page: {
    page_number: 1,
    row_limit_per_page: 20,
    total: 29
  },
  list: [
    {
      'id|+1': 0,
      user_uuid: 'e49c1405-a1be-4e71-b142-72e75e05c080',
      user_name: '赵玉真',
      alias_name: '赵玉真',
      role_key: '管理员',
      status: 0,
      updater: '0',
      email: '我是一个邮箱',
      create_time: '2021-10-21T03:13:40.636575Z',
      update_time: '2021-10-21T03:16:40.636575Z',
      project: ['已经', '有了']
    },
    {
      'id|+1': 0,
      user_uuid: 'e49c1405-a1be-4e71-b142-72e75e05c081',
      user_name: '赵玉真',
      alias_name: '赵玉真',
      role_key: '管理员',
      status: 0,
      updater: '0',
      email: '我是一个邮箱',
      create_time: '2021-10-21T03:13:40.636575Z',
      update_time: '2021-10-21T03:16:40.636575Z',
      project: ['已经', '有了']
    },
    {
      'id|+1': 0,
      user_uuid: 'e49c1405-a1be-4e71-b142-72e75e05c082',
      user_name: '赵玉真',
      alias_name: '赵玉真',
      role_key: '管理员',
      status: 0,
      updater: '0',
      email: '我是一个邮箱',
      create_time: '2021-10-21T03:13:40.636575Z',
      update_time: '2021-10-21T03:16:40.636575Z',
      project: ['已经', '有了']
    }
  ],
  sort: 'update_time',
  order: 'desc'
})
let data = userList

// 获取角色列表
const roleList = Mock.mock({
  page: {
    page_number: 1,
    row_limit_per_page: 10,
    total: 2
  },
  list: [
    {
      role_uuid: '123a4b56-7890-1234-5678-901c23d4ef51',
      role_key: 'admin',
      role_name: '管理员',
      'creater|+1': '0',
      created: '2022-01-01 00:00:00',
      updater: '0',
      updated: '2022-01-02 00:00:00'
    },
    {
      role_uuid: '123a4b56-7890-1234-5678-901c23d4ef52',
      role_key: 'user',
      role_name: '用户',
      'creater|+1': '0',
      created: '2022-01-01 00:00:00',
      updater: '0',
      updated: '2022-01-02 00:00:00'
    },
    {
      role_uuid: '123a4b56-7890-1234-5678-901c23d4ef53',
      role_key: 'superadmin',
      role_name: '超级管理员',
      'creater|+1': '0',
      created: '2022-01-01 00:00:00',
      updater: '0',
      updated: '2022-01-02 00:00:00'
    }
  ],
  sort: 'updated',
  order: 'desc'
})

// 编辑用户
const singleUserData = {
  user_uuid: '21b68ce4-98a6-4574-b21f-8fcf6370839c',
  roles: [
    {
      role_uuid: '123a4b56-7890-1234-5678-901c23d4ef51',
      role_key: 'admin',
      role_name: '管理员',
      creater: '0',
      create_time: '2022-02-23T10:58:13.882020+08:00',
      updater: '0',
      update_time: '2022-02-23T10:58:13.882036+08:00',
      status: 0
    }
  ],
  studys: [
    {
      study_uuid: 'f02c0738-21ce-44c5-80dd-a4bb23c82dd0',
      study_name: '专题1',
      study_description: '骨髓专题相关内容1',
      study_owner:'user_name',
      create_time: '2021-09-22 05:16:52',
    },
    {
      study_uuid: '985feea4-1c7b-410e-9bf1-8fc95fdcc261',
      study_name: '专题2',
      study_description: '骨髓专题相关内容1',
      study_owner:'user_name',
      create_time: '2021-09-22 05:16:52',
    }
  ],
  user_name: 'user_0',
  alias_name: '用户0',
  password: '123456',
  email: '0_user@user.com',
  status: 1,
  creater: '0',
  create_time: '2022-02-23T11:00:01.850114+08:00',
  updater: '0',
  update_time: '2022-02-23T13:42:38.088875+08:00'
}
// 编辑成功返回信息
const editReturned = {
  user_uuid: '21b68ce4-98a6-4574-b21f-8fcf6370839c',
  email: '0000@user.com'
}

import user from '../api/user.js'
export default [
  { // 获取用户列表
    url: `/mock/${user.getUserManage.url}`,
    method: 'post',
    response: req => {
      return new HttpData(data)
    }
  },
  { // 添加用户
    url: `/mock/${user.operationUser.url}`,
    method: 'post',
    response: req => {
      console.log(req)
      // 添加
      if (req.body.user_name && req.body.email && req.body.list_role_id && !req.body.status) {
        const userName = req.body.user_name
        data.list.push({ user_name: userName, user_uuid: '12345' })
        return new HttpData({})
      }
      // 编辑
      if (req.body.user_uuid && !req.body.status && req.body.user_name) {
        data.list[0].user_name = req.body.user_name
        return new HttpData(editReturned)
      } else if (req.body.user_uuid && !req.body.status && req.body.password) { // 重置密码
        return new HttpData('success')
      } else if (req.body.user_uuid && req.body.status) { // 删除用户
        data.list.pop()
        return new HttpData({})
      }/*  else if (req.body.list_study_id && !req.body.status && !req.body.user_name) {
        return new HttpData('success')
      } */
    }
  },
  {
    url: `/mock/${user.getRolesList.url}`,
    method: 'get',
    response: req => {
      return new HttpData(roleList)
    }
  },
  { // 获取编辑用户
    url: `/mock/${user.getEditUserInfo.url}e49c1405-a1be-4e71-b142-72e75e05c080/`,
    method: 'get',
    response: req => {
      return new HttpData(singleUserData)
    }
  }
]