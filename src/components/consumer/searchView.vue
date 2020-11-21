<template>
  <div id="search">
    <search :list="[[]]"></search>
    <div class="no" v-if="list.length ===0">没有找到相关商品哦~</div>
    <div class="block" v-for="(i, j) in list" :key="j">
      <router-link :to="{name: '商品', params: {id: i._id}}">
      <div>
        <img width="200px" :src="i.imgArr[0]" alt="">
      </div>
      <div style="padding: 1rem 0 0 4rem;">
        <p>{{i.name}}</p>
        <p style="color: red;">￥{{i.jg}}</p>
        <p>销量：{{i.sales}}</p>
      </div>
      </router-link>
    </div>
    <div class="exit"><router-link to="/">回到首页</router-link></div>
  </div>
</template>

<script>
import search from '@/components/consumer/search.vue'
export default {
  components: { search },
  data () {
    return {
      list: [],
      sp: 'sp/'
    }
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getList()
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      // 搜索
      this.axios.get(`${this.ip}/search?dpName=${this.$route.params.name}`)
        .then(i => {
          this.list = i.data
        })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .exit{
    a{
      color: #fff;
    }
    width: 5rem;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    position: fixed;
    bottom: 2rem;
    left:50%;
    z-index:999;
    transform: translateX(-50%);
    background-color: #ff5500;
  }
  #search{
    height: 100%;
    background-color: #fff;
  }
  .no{
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }
  .block{
    width: 100%;
    height: 20%;
    margin-top: 1rem;
    div{
      width:45%;
      float:left;
      font-size:18px;
      height: 100%;
      img{
        height: 100%;
      }
      box-sizing: border-box;
      p{
        font-weight: bold;
        color:#000;
        margin-top: 1rem;
      }
    }
  }
</style>
