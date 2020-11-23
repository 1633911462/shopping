<template>
  <div id="admin">
    <div class="header">后台管理</div>
    <router-link v-for="(i, j) in block" :key="j" :to="i.src">
      <div class="block">
        <div :class="i['class']" class="left"></div>
        <div class="center">
          <p>{{i.title}}</p>
          <span>{{i.content}}</span>
        </div>
        <div class="right" v-if="i.msg">{{i.msg}}</div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      block: [
        {
          class: 'a',
          title: '用户列表',
          content: '新增用户，请及时查看',
          src: '/userList',
          msg: ''
        },
        {
          class: 'b',
          title: '支付订单',
          content: '订单发生变化，请及时查看',
          src: '/rootOrder',
          msg: ''
        },
        {
          class: 'd',
          title: '店铺审核',
          content: '店铺审核通知，请及时查看',
          src: '/dpMsg',
          msg: ''
        },
        {
          class: 'e',
          title: '用户消息',
          content: '您有新的消息，请及时查看',
          src: '',
          msg: ''
        },
        {
          class: 'f',
          title: '返回主页',
          content: '返回用户页面',
          src: '/me',
          msg: ''
        }
      ],
      user: '',
      order: '',
      sp: '',
      dp: '',
      msg: ''
    }
  },
  created () {
    if (JSON.parse(atob(localStorage.userName)).user !== 'admin') {
      this.$router.replace('/me')
      return false
    }
    this.getList()
  },
  methods: {
    getList () {
      this.axios.get(`${this.ip}/examine?type=dp`)
        .then(i => {
          var num = 0
          for (var j of i.data) {
            if (!j.result) {
              num++
            }
          }
          this.block[2].msg = num
        })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  #admin{
    background-color: #fff;
    height: 100%;
    .header{
      @height: 50px;
      position: sticky;
      top:0;
      width: 100%;
      background-color: #4E5FE3;
      text-align:center;
      line-height: @height;
      height: @height;
      color: #fff;
      font-size: 18px;
      z-index: 9999;
    }
    .block{
      height: 70px;
      color: #000;
      line-height: 50px;
      width: 100%;
      position: relative;
      z-index: 0;
      border-bottom: 1px solid #f7f7f7;
      div{
        float: left;
      }
      .left{
        width: 14%;
        margin: 0.6rem 1rem;
        height: 50px;
        background-size: contain;
        background-repeat: no-repeat;
      }
      .a{
        background-image: url(../../assets/icon_35.png);
      }
      .b{
        background-image: url(../../assets/icon_33.png);
      }
      .c{
        background-image: url(../../assets/icon_13.png);
      }
      .d{
        background-image: url(../../assets/icon_18.png);
      }
      .e{
        background-image: url(../../assets/icon_01.png);
      }
      .f{
        background-image: url(../../assets/icon_34.png);
      }
      .center{
        @px: 50%;
        width: @px;
        height: 100%;
        font-size: 16px;
        line-height: 20px;
        position: relative;
        top:1rem;
        span{
          color: #999;
          font-size:14px;
        }
      }
      .right{
        @px: 20px;
        text-align: center;
        line-height: 20px;
        color:#fff;
        width: @px;
        height: @px;
        float: right;
        position: relative;
        right: 1rem;
        top:2rem;
        font-size: 14px;
        background: red;
        border-radius: 50%;
      }
    }
  }
</style>
