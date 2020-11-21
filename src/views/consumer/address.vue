<template>
  <div id="address">
    <adminHead :to="to">我的收货地址</adminHead>
    <div class="bg">
      <div class="address" @click="active(i)" v-for="(i, j) in list" :key="j">
        <div class="tx" :style="i.default ? {backgroundColor: '#55aaff'} : ''">{{i.name.split('')[0]}}</div>
        <div class="msg">
          <p>{{i.name}} <span style="color: #999;">{{i.number}}</span></p>
          <div v-if="i.default">默认</div>
          <span>{{i.address}}</span>
        </div>
        <div class="update">
          <router-link :to="{path: '/addAddress', query: {msg: i}}" replace>编辑</router-link>
        </div>
      </div>
      <div class="add">
        <router-link to="/addAddress" replace>添加新地址</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
export default {
  components: { adminHead },
  data () {
    return {
      list: [],
      to: '/me'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.path !== '/address') {
        // vm.$router.go(0)
      }
    })
  },
  created () {
    if (this.$route.query.active === 'true') {
      this.to = '/payment'
    }
    this.axios.get(`${this.ip}/getAddress?user=${JSON.parse(atob(localStorage.userName)).user}`)
      .then(i => {
        for (var j in i.data) {
          if (i.data[j].default) {
            i.data.unshift(i.data.splice(j, 1)[0])
          }
        }
        this.list = i.data
      })
  },
  methods: {
    active (i) {
      if (this.$route.query.active) {
        document.cookie = `address=${i._id}`
        this.$router.replace('/payment')
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  #address{
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    .bg{
      width: 100%;
      height: auto;
      background-color: #fff;
      padding: 1rem 0;
      .address{
        width: 100%;
        height: auto;
        display: flex;
        box-sizing: border-box;
        padding: 0.5rem;
        // margin-top:1rem;
        .tx{
          @width: 40px;
          flex: 1.1;
          width: @width;
          height: @width;
          transform: translateY(50%);
          background-color: #ccc;
          text-align: center;
          line-height: @width;
          border-radius: 50%;
        }
        .msg{
          flex: 7;
          margin-left: 1rem;
          line-height: 25px;
          p{
            font-size: 18px;
            span{
              font-size: 15px;
            }
          }
          // float:left;
          div{
            width: 50px;
            display: inline-block;
            height: 25px;
            line-height: 25px;
            color:#ff6f1c;
            background: #f9e7ff;
            text-align: center;
          }
        }
        .update{
          height: 30px;
          border-left: 1px solid #ccc;
          flex: 1.1;
          position: relative;
          top:100%;
          color: #999;
          transform: translateY(110%);
          padding-left: 0.5rem;
          // line-height: 100px;
        }
      }
      .add{
        clear: both;
        a{
          color: #fff;
        }
        width: 100px;
        height: 50px;
        margin: 0 auto;
        border-radius: 12px;
        background: #55aaff;
        text-align: center;
        line-height: 50px;
        color: #fff;
      }
    }
  }
</style>
