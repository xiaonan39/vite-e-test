import { request } from '@/utils/request'
import user from './user.js'
import uploadImage from './uploadImage.js'
import AIEngine from './AIEngine.js'

const baseUrl = import.meta.env.VITE_APP_URL
const bussiness = {
  user,
  uploadImage,
  AIEngine,
}

Object.keys(bussiness).forEach(k => {
  bussiness[k] = request.getRequest(bussiness[k], baseUrl)
})

export default {
  ...bussiness
}