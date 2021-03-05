<template>
  <div id="msg">
    <div class="head">
      <h3>消息</h3>
    </div>
    <div class="list">
      <div class="item" v-for="i in list" :key="i._id" @click="tz(i)">
        <img :src="i.url" />
        <p style="margin-left:2%;font-size:14px;">{{i.user === $store.state.me.user ? (i.tarUser === 'root' ? '客服' : i.tarUser) : (i.user === 'root' ? '客服' : i.user)}}</p>
        <p style="margin-left:20%;color:#666;">{{i.msg}}</p>
        <div v-if="msgNum(i.user)" class="right">{{msgNum(i.user)}}</div>
        <span>{{new Date(i.time).toLocaleDateString() + ' ' + new Date(i.time).toLocaleTimeString()}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      read: [],
      dpName: null
    }
  },
  methods: {
    // 新消息
    newMsg (data) {
      let key1 = true
      for (let i in this.list) {
        if (this.list[i].user === data.fsr) {
          key1 = false
          this.$set(this.list[i], 'msg', data.msg)
          this.$set(this.list[i], 'time', data.time)
          this.list.sort((a, b) => {
            return b.time - a.time
          })
        }
      }
      if (key1) {
        // 如果新消息，但是消息列表没有他情况
        this.axios.post(`${this.ip}/myDp`, {
          dpName: data.user
        }).then(j => {
          this.axios.post(`${this.ip}/user`, {
            user: j.data.user
          }).then(k => {
            data.url = k.data.url
            this.list.push(data)
          })
        })
      }
      let key = true
      for (let i in this.read) {
        if (this.read[i].user === data.user) {
          key = false
          this.$set(this.read[i], 'num', this.read[i].num + 1)
        }
      }
      if (key) {
        this.read.push({
          user: data.user,
          num: 1
        })
      }
    },
    // 消息数量
    msgNum (user) {
      for (let i in this.read) {
        if (this.read[i].user === user) {
          return this.read[i].num
        }
      }
    },
    tz (i) {
      var user = i.tarUser
      if (i.user !== this.$store.state.me.user) {
        user = i.user
      }
      this.$root.userMsg = this.$root.userMsg - (this.msgNum(i.user))
      if (i.tarUser === 'root' || i.user === 'root') {
        this.$router.push(`/chat?user=${user}&root=true&me=true`)
        return false
      }
      this.$router.push(`/chat?user=${user}`)
    },
    // 获取消息列表
    msgList (user) {
      this.axios.post(`${this.ip}/chatList`, {
        user: user
      }).then(i => {
        var body = []
        for (var j in i.data) {
          // 查找未读消息
          if (i.data[j].read !== true && i.data[j].readUser === user) {
            let isRead = true
            for (let s in this.read) {
              if (this.read[s].user === i.data[j].user) {
                this.$set(this.read[s], 'num', this.read[s].num + 1)
                isRead = false
              }
            }
            if (isRead) {
              // 未读
              this.read.push({
                user: i.data[j].user,
                num: 1
              })
            }
          }
          if (j === '0') {
            body.push(i.data[j])
          } else {
            var key = true
            if (i.data[j].tarUser !== user) {
              for (var h = 0; h < j; h++) {
                if (i.data[j].tarUser === i.data[h].tarUser || i.data[j].tarUser === i.data[h].user) {
                  key = false
                }
              }
              if (key) {
                body.push(i.data[j])
              }
            } else {
              for (var n = 0; n < j; n++) {
                if (i.data[j].user === i.data[n].tarUser || i.data[j].user === i.data[n].user) {
                  key = false
                }
              }
              if (key) {
                body.push(i.data[j])
              }
            }
          }
        }
        this.list = body
        for (let k in body) {
          if (body[k].user === user) {
            this.axios.post(`${this.ip}/myDp`, {
              dpName: body[k].tarUser
            }).then(j => {
              this.axios.post(`${this.ip}/user`, {
                user: j.data.user
              }).then(n => {
                if (body[k].tarUser === 'root') {
                  this.$set(this.list[k], 'url', this.list[k].tp)
                  return false
                }
                this.$set(this.list[k], 'url', n.data.url)
              })
            })
          } else {
            this.axios.post(`${this.ip}/myDp`, {
              dpName: body[k].user
            }).then(j => {
              this.axios.post(`${this.ip}/user`, {
                user: j.data.user
              }).then(n => {
                if (body[k].user === 'root') {
                  this.$set(this.list[k], 'url', this.list[k].tp)
                  return false
                }
                this.$set(this.list[k], 'url', n.data.url)
              })
            })
          }
        }
      })
    }
  },
  mounted () {
    this.$root._that2 = this
    var time1 = setInterval(() => {
      var user = this.$store.state.me.user
      if (user) {
        clearInterval(time1)
        this.msgList(user)
      }
    }, 200)
  }
}
</script>

<style lang="less" scoped="scoped">
.right{
        @px: 20px;
        text-align: center;
        line-height: 20px;
        color:#fff;
        width: @px;
        height: @px;
        position: absolute;
        right: 1rem;
        font-size: 14px;
        background: red;
        border-radius: 50%;
      }
  .head{
   position: sticky;
   top:0px;
   z-index:1;
   width: 100%;
   height: 40px;
   text-align: center;
   line-height: 40px;
   background: #f1f1f0;
   border-bottom: 1px solid #fff;
   h3{
     text-align: center;
   }
  }
  .item{
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    padding: 10px 5px;
    position: relative;
    img{
      width:30px;
      object-fit: cover;
    }
    p{
      margin-left: 5%;
    }
    span{
      font-size: 12px;
      position: absolute;
      right:0.5rem;
      top:40px
    }
  }
</style>
