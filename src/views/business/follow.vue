<template>
  <div id="follow">
    <adminHead to="/me">我的关注</adminHead>
    <div class="dp" v-for="(i, j) in list" :key="j">
      <router-link :to="'/dpIndex/' + i.user">
        {{i.dpName}}
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
      list: []
    }
  },
  created () {
    this.axios.get(`${this.ip}/follow?id=${this.$route.params.id}`)
      .then(i => {
        this.list = i.data
      })
  }
}
</script>

<style lang="less" scoped="scoped">
  .dp{
    width: 100%;
    height: 70px;
    margin-top: 1rem;
    font-size: 20px;
    line-height: 70px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #ccc;
    a{
      color:blue;
    }
  }
  .dp:active{
    background: #55ff7f;
    color: red;
  }
</style>
