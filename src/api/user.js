// helloWorld
export default {
  getUserManage: {
    url: 'macaria/user/',
    method: 'POST'
  },
  operationUser: { // 添加用户
    url: 'macaria/user/',
    method: 'POST'
  },
  getRolesList: {
    url: 'macaria/role/',
    method: 'GET'
  },
  getEditUserInfo: { // 获取当前用户信息
    url: 'macaria/edituser/',
    method: 'GET'
  }
}