<template>
  <div id="me">
    <input class="file" @change="htx()" accept="image/jpeg, image/png" ref="file" type="file">
    <img ref="tx" :src="this.$store.state.me.url ? this.$store.state.me.url : require('@/assets/xing.png')" width="100" alt="" height="100">
    <h3>{{this.$store.state.me.name}}，你好</h3>
      <router-link to="/userOrder">
        <div class="blo">我的订单</div>
      </router-link>
    <router-link :to="'/follow/' + this.$store.state.me._id">
      <div class="blo">我的关注</div>
    </router-link>
    <router-link to="/business">
      <div class="blo">我的店铺</div>
    </router-link>
    <router-link to="/address">
      <div class="blo">收货地址</div>
    </router-link>
    <div class="blo">联系客服</div>
    <router-link :to="'/history/' + this.$store.state.me._id">
      <div class="blo">足迹</div>
    </router-link>
    <router-link to="/adminIndex">
      <div class="blo">管理员入口</div>
    </router-link>
    <router-link to="/login">
      <div class="blo">退出登录</div>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    htx () {
      var formData = new FormData()
      formData.append('file', this.$refs.file.files[0])
      formData.append('user', JSON.stringify({
        user: this.$store.state.me.user,
        password: this.$store.state.me.password
      }))
      this.axios.post(`${this.ip}/htx`, formData)
      this.$refs.tx.src = URL.createObjectURL(this.$refs.file.files[0])
    }
  }
}
</script>

<style lang="less" scoped>
  h3{
    display: inline-block;
    font-size: 30px;
  }
  .file{
    position: absolute;
    top:0;
    left: 0;
    z-index: 99;
    width: 100px;
    height: 100px;
    border: 0px;
    box-sizing: border-box;
    opacity: 0;
  }
  a{
    color: #000;
  }
  .blo{
    width: 80%;
    height: 40px;
    margin:1.5rem auto;
    text-align: center;
    line-height: 40px;
    background-color: #fff;
    border-radius: 12px;
  }
</style>
