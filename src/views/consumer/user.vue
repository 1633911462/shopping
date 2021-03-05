<template>
  <div id="user">
    <router-view></router-view>
    <div class="zz"></div>
    <div class="nav" ref="nav">
      <div><router-link to="/">首页</router-link></div>
      <div><router-link to="/msg">消息</router-link><p v-if="msgNum" class="right">{{msgNum}}</p></div>
      <div><router-link to="/car">购物车</router-link></div>
      <div><router-link to="/me">我的</router-link><p v-if="myNum || kefuMsg" class="right">{{myNum + kefuMsg}}</p></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msgNum: null,
      myNum: null,
      kefuMsg: null
    }
  },
  created () {
    this.getMe()
  },
  mounted () {
    this.$root._that = this
    this.initMsg()
  },
  methods: {
    newMsg () {
      this.initMsg()
    },
    initMsg () {
      if (this.$root.dpMsg) {
        this.myNum = this.$root.dpMsg
      }
      if (this.$root.kefuMsg) {
        this.kefuMsg = this.$root.kefuMsg
      }
      if (this.$root.userMsg) {
        this.msgNum = this.$root.userMsg
      }
    }
  },
  watch: {
    // 监听路由变化
    $route: {
      handler (newValue, oldValue) {
        this.$nextTick(() => {
          document.getElementsByClassName('router-link-exact-active')[0].classList.add('active')
        })
      },
      deep: true,
      immediate: true
    }
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
        top:0;
        right: 1rem;
        font-size: 14px;
        background: red;
        border-radius: 50%;
      }
  @height: 50px;
  .active{
    border-bottom: 1px solid green;
    color: red !important;
  }
  .zz{
    height: @height;
    width:100%;
  }
  .nav{
    width: 100%;
    height: @height;
    display: flex;
    background-color: #fff;
    border-top: 1px solid #DCDCDC;
    position: fixed;
    z-index: 99999;
    bottom: 0;
    div{
      position: relative;
      width:20%;
      height: 100%;
      flex: 2;
      text-align: center;
      line-height: @height;
      a{
        color:#000;
        text-decoration: none;
        font-size: 16px;
      }
    }
  }
</style>
