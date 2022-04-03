<template>
  <!-- 退出按钮 -->
  <el-button type="success" round @click="logout">退出</el-button>
</template>

<script>
export default {
  methods: {
    // 点击退出按钮,清空sessionStorage的token
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>