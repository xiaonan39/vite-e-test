<template>
  <div class="nav-header">
    <div class="nav-left" >
      <img src="@/assets/image/login_logo.svg" @click="$router.push('/')">
    </div>
    <div class="nav-right"></div>
  </div>

</template>

<script setup>

</script>

<style scoped lang="scss">
.nav-header {
  // background: var(--theme-white);
  background: var(--theme-light-grey);
  height: 60px;
  // width: 100%;
  display: flex;
  justify-content: space-between;
  .nav-left {
    width: 230px;
    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}


</style>