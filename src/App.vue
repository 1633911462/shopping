<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted () {
    // 自动登录
    if (localStorage.userName) {
      this.axios.post(`${this.ip}/isUser`, JSON.parse(window.atob(localStorage.userName)))
        .then(async i => {
          if (i.data) {
            await this.getMe()
            console.log('自动登录成功')
          } else {
            this.$router.push('/login')
            alert('密码已更改')
          }
        })
    } else {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
  *{
    margin: 0;
    padding: 0;
    -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }
  a{
    text-decoration: none;
  }
  html,body,#app{
    height: 100%;
    background-color: #f1f1f1;
  }
</style>
