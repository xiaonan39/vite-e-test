<template>
  <div class="default-home">
    <h1 class="box">我是hello world页面</h1>
    <div class="fetchData">
      <ul>
        <li v-for="item in list.data">
          {{ item }}
        </li>
      </ul>
    </div>
    <img src="@/assets/image/微信图片_202204181605354.jpg"/>
    <p class="font-size-s">s字号</p>
    <p class="font-size-xl">xl字号</p>
  </div>
</template>

<script setup name="home">
import { ref } from 'vue'
import imgUrl from '@/assets/logo.png'
import API from 'API'

defineProps({
  msg: String
})

const list = ref('')
console.log(API)
/* API.user.getUserManage()
  .then((res) => {
    list.value = res.data
  })
  .catch(err => {
    console.log(err)
  }) */
</script>



<style scoped lang='scss'>
@import '~/style/scss.scss';

.default-home {
  h1 {
    color: #42b983;
  }
  img {
    width: 100%;
  }
}
</style>
