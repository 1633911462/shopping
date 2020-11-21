<template>
  <div id="mySp">
    <adminHead to="/business">商品列表</adminHead>
    <p v-if="!list.length > 0" style="text-align: center;margin-top:50%">快去添加商品吧~</p>
    <div class="block" v-for="(i, j) in list" :key="j">
      <p>商品名称：{{i.name}}</p>
      <p>价格：{{i.jg}}</p>
      <p>尺码：{{i.size}}</p>
      <p>类型：{{i.type}}</p>
      <p>销量：{{i.sales}}</p>
      <p>添加时间：{{i.date}}</p>
    </div>
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
export default {
  components: { adminHead },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.axios.get(`${this.ip}/spList?user=${JSON.parse(atob(localStorage.userName)).user}`)
      .then(i => {
        this.list = i.data
      })
  }
}
</script>

<style lang="less" scoped="scoped">
  h3{
    text-align: center;
    padding-top:0.5rem;
    a{
      color:#000;
    }
  }
  .block{
    width: 80%;
    margin: 1rem auto;
    min-height: 100px;
    padding: 1rem;
    background-color: #fff;
    border-radius: 12px;
    font-size:18px;
  }
</style>
