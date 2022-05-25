import user from './user.js'
import uploadImage from './uploadImage.js'

// const baseUrl = import.meta.env.VITE_APP_URL
const bussiness = {
  user,
  uploadImage
}

/* Object.keys(bussiness).forEach(k => {
  bussiness[k] = request.getRequest(bussiness[k], baseUrl)
})
 */
export default {
  ...bussiness
}