<template>
  <div id="user">
    <router-view></router-view>
    <div class="zz"></div>
    <div class="nav" ref="nav">
      <div><router-link to="/">首页</router-link></div>
      <div><router-link to="/msg">消息</router-link></div>
      <div><router-link to="/car">购物车</router-link></div>
      <div><router-link to="/me">我的</router-link></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created () {
    this.getMe()
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
