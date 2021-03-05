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
            await this.getDp()
            // 初始化(订阅消费者消息和商家消息)
            this.$socket.emit('init', {
              user: this.$store.state.me.user,
              dpName: this.$store.state.myDp.dpName
            })
            // 未读消息
            this.sockets.subscribe('userMsg', (data) => {
              this.$root.userMsg = data.length
              if (this.$root._that) {
                this.$root._that.initMsg(data.length)
              }
            })
            this.sockets.subscribe('dpMsg', (data) => {
              this.$root.dpMsg = data.length
              if (this.$root._thatMe) {
                this.$root._thatMe.initMsg(data.length, true)
              }
              if (this.$root._that) {
                this.$root._that.initMsg(data.length, true)
              }
            })
            this.sockets.subscribe('kefu', (data) => {
              this.$root.kefuMsg = data.length
              if (this.$root._that) {
                this.$root._that.initMsg(data.length)
                this.$root._thatMe.initMsg(data.length, true)
              }
            })
            // 实时监听消息
            this.sockets.subscribe('msg', (data) => {
              // 当前在聊天页面
              if (this.$route.path === '/chat') {
                this.$root._that.jtMsg(data)
              } else {
                if (data.tarUser === 'root') {
                  this.$root.kefuMsg++
                  if (this.$root._that) {
                    this.$root._that.newMsg(data)
                  }
                  if (this.$root._thatMe) {
                    this.$root._thatMe.initMsg(data, true)
                  }
                  // this.$root.thatRoot.newMsg(data)
                  return false
                }
                // 当前不在聊天页面（显示红点）
                if (this.$store.state.myDp.dpName === data.tarUser) {
                  this.$root.dpMsg++
                } else {
                  this.$root.userMsg++
                }
                if (this.$root._that2) {
                  this.$root._that2.newMsg(data)
                }
                if (this.$root.thatRoot) {
                  this.$root.thatRoot.newMsg(data)
                }
                if (this.$root._thatMe) {
                  this.$root._thatMe.initMsg(data.length, true)
                }
                this.$root._that.newMsg(data)
              }
            })
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
