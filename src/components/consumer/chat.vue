<template>
  <div id="chat">
    <!-- 聊天头部 -->
    <div class="header">
      <span @click="$router.go(-1)">返回</span>
      <h4>{{msg.tarUser === 'root' ? '客服' : msg.tarUser}}</h4>
    </div>
    <div class="head_zwf"></div>
    <!-- 聊天内容 -->
    <div ref="content" class="content">
      <div :class="i.user !== msg.user ? ['he','con_item'] : ['me','con_item']" v-for="i in msgList" :key="i._id">
        <img :src="i.user !== msg.user ? tarImg : img" alt="">
        <p>{{i.msg}}</p>
      </div>
    </div>
    <!-- 发送消息 -->
    <div class="send">
      <input type="text" @keydown="sendMsg(true, $event)" v-model="msg.msg">
      <button @click="sendMsg">发送</button>
    </div>
    <div class="zwf"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: {
        user: null,
        tarUser: 'null',
        msg: ''
      },
      tarImg: '',
      img: '',
      msgList: []
    }
  },
  methods: {
    // 实时监听消息
    jtMsg (data) {
      this.msgList.push(data)
      // 将内容显示最新
      this.$nextTick(() => {
        window.scrollTo(0, this.$refs.content.scrollHeight)
      })
    },
    sendMsg (key, e) {
      if (key === true) {
        if (e.code !== 'Enter') {
          return ''
        }
      }
      if (this.msg.msg === '') {
        alert('不能为空')
        return false
      } else {
        this.axios.post(`${this.ip}/myDp`, {
          user: this.msg.user
        }).then(i => {
          if (this.$store.state.me.user === 'admin' && this.$route.query.root && !this.$route.query.me) {
            alert('您已经是最高权限，无需联系客服！！！')
            return false
          }
          if (i.data.dpName === this.msg.tarUser) {
            alert('无法给自己发送消息！！！')
            return false
          } else {
            if (this.$route.query.dp) {
              this.msg.dp = true
            }
            this.$socket.emit('sendMsg', {
              msg: this.msg
            })
            var msg = JSON.parse(JSON.stringify(this.msg))
            this.msgList.push(msg)
            this.msg.msg = ''
            // 将内容显示最新
            this.$nextTick(() => {
              window.scrollTo(0, this.$refs.content.scrollHeight)
            })
          }
        })
      }
    },
    // 查找用户信息
    async getMsgList (qx) {
      var user = this.msg.tarUser
      if (!this.$route.query.dp && qx !== 'root') {
        await this.axios.post(`${this.ip}/myDp`, {
          dpName: this.msg.tarUser
        }).then(k => {
          // this.msg.tarUser = k.data.user
          user = k.data.user
        })
      }
      if (this.$route.query.root && qx !== 'root') {
        user = 'root'
      }
      if (qx === 'kefu') {
        let img = await this.getMe({
          user: 'admin'
        })
        this.tarImg = img.gly
        return false
      }
      this.axios.post(`${this.ip}/user`, {
        user: user
      }).then(j => {
        if (j.data) {
          this.tarImg = j.data.url
        } else {
          this.axios.post(`${this.ip}/myDp`, {
            dpName: user
          }).then(n => {
            this.axios.post(`${this.ip}/user`, {
              user: n.data.user
            }).then(m => {
              this.tarImg = m.data.url
            })
          })
        }
      })
    }
  },
  mounted () {
    this.$root._that = this
    this.msg.tarUser = this.$route.query.user
    if (!this.msg.tarUser && !this.$route.query.root) {
      this.$router.push('/')
      return false
    } else if ((!this.msg.tarUser || this.msg.tarUser === 'root') && this.$route.query.root) {
      // 联系客服
      this.msg.tarUser = 'root'
      // 获取聊天列表
      var time2 = setInterval(() => {
        if (this.$route.query.dp) {
          this.msg.user = this.$store.state.myDp.dpName
        } else {
          this.msg.user = this.$store.state.me.user
        }
        this.img = this.$store.state.me.url
        if (this.msg.user) {
          clearInterval(time2)
          this.axios.post(`${this.ip}/chat`, this.msg).then(i => {
            this.msgList = i.data
            // 将内容显示最新
            this.$nextTick(() => {
              window.scrollTo(0, this.$refs.content.scrollHeight)
            })
            this.getMsgList('kefu')
          })
        }
      }, 100)
      // 管理员视角
    } else if (this.msg.tarUser && this.$route.query.root) {
      // 获取聊天列表
      var time3 = setInterval(async () => {
        this.msg.user = 'root'
        let img = await this.getMe()
        this.img = img.gly
        if (this.msg.user) {
          clearInterval(time3)
          this.axios.post(`${this.ip}/chat`, this.msg).then(i => {
            this.msgList = i.data
            // 将内容显示最新
            this.$nextTick(() => {
              window.scrollTo(0, this.$refs.content.scrollHeight)
            })
            this.getMsgList('root')
          })
        }
      }, 100)
    } else {
      // 获取聊天列表
      var time1 = setInterval(() => {
        if (this.$route.query.dp) {
          this.msg.user = this.$store.state.myDp.dpName
        } else {
          this.msg.user = this.$store.state.me.user
        }
        this.img = this.$store.state.me.url
        if (this.msg.user) {
          clearInterval(time1)
          this.axios.post(`${this.ip}/chat`, this.msg).then(i => {
            this.msgList = i.data
            // 将内容显示最新
            this.$nextTick(() => {
              window.scrollTo(0, this.$refs.content.scrollHeight)
            })
            this.getMsgList()
          })
        }
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
  #chat{
    .header{
      background-color: #f1f1f1;
      position: fixed;
      top:0;
      text-align: center;
      width: 100%;
      height: 40px;
      line-height: 40px;
      span{
        position: absolute;
        left:2%;
        top:50%;
        transform: translate(0,-50%);
      }
    }
    .head_zwf{
      height: 40px;
    }
    .content{
      width: 100%;
      // height: 600px;
      overflow: scroll;
      .me{
        flex-direction:row-reverse;
      }
      .he{
        flex-direction:row;
      }
      .con_item{
        width: 100%;
        min-height: 50px;
        display: flex;
        align-items: center;
        img{
          margin-left: 5px;
          width: 30px;
          height: 30px;
          object-fit: contain;
        }
        p{
          border: 0.2px solid #000;
          border-radius: 12px;
          padding: 5px;
          background: #fff;
          margin-left: 5px;
        }
      }
    }
    .send{
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 60px;
      input{
        width: 80%;
        height: 100%;
        border: 0;
      }
      button{
        width:20%;
        height: 100%;
      }
    }
    .zwf{
      height: 60px;
    }
  }
</style>>
