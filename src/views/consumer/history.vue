<template>
  <div id="history">
    <adminHead to="/me">足迹</adminHead>
    <div v-if="!list" class="no">还没有浏览商品哦~</div>
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
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
export default {
  components: { adminHead },
  data () {
    return {
      list: null
    }
  },
  created () {
    this.axios.get(`${this.ip}/history?id=${this.$route.params.id}`)
      .then(i => {
        this.list = i.data
        this.list = this.list.sort((a, b) => {
          if (a.date > b.date) {
            return -1
          } else {
            return 1
          }
        })
      })
  }
}
</script>

<style lang="less" scoped="scoped">
  .no{
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  .block{
    width: 100%;
    // margin-top: 1rem;
    div{
      width:45%;
      height: 200px;
      float:left;
      margin-top:1rem;
      font-size:18px;
      box-sizing: border-box;
      img{
        height: 100%;
      }
      p{
        font-weight: bold;
        color:#000;
        margin-top: 1rem;
      }
    }
  }
</style>
