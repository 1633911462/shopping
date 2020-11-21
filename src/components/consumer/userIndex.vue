<template>
  <div id="userIndex">
    <search :list="list"></search>
    <!-- 新品 -->
    <div class="Boutique">
    <h4><img width="30" src="@/assets/xing.png" alt="">新品推荐</h4>
    <div class="block" v-if="list.length === 2">
      <div class="sp"  v-for="(i, j) in list[1].filter(this.os)" :key="j">
        <router-link :to="sp + i._id">
        <img class="img" width="150" :src="i.imgArr[0]" alt="">
        <div class="mx">
          <p style="font-size: 14px;">{{i.name}}</p>
          <span style="color: red;font-size: 18px;">￥{{i.jg}}</span><span style="font-size: 12px;color: #DCDCDC;padding-left: 0.5rem;">{{i.sales}}人付款</span>
        </div>
        </router-link>
      </div>
    </div>
    <div class="block_"></div>
    <div class="block" v-if="list.length === 2">
      <div class="sp" v-for="(i, j) in list[1].filter(this.js)" :key="j">
        <router-link :to="sp + i._id">
        <img class="img" width="150" :src="i.imgArr[0]" alt="">
        <div class="mx">
          <p style="font-size: 14px;">{{i.name}}</p>
          <span style="color: red;font-size: 18px;">￥{{i.jg}}</span><span style="font-size: 12px;color: #DCDCDC;padding-left: 0.5rem;">{{i.sales}}人付款</span>
        </div>
        </router-link>
      </div>
    </div>
    </div>
    <!-- 精品 -->
    <div class="Boutique">
      <h4><img width="30" src="@/assets/xing.png" alt="">精品推荐</h4>
      <div class="block" v-if="list.length === 2">
        <div class="sp" v-for="(i, j) in list[0].filter(this.os)" :key="j">
          <router-link :to="sp + i._id">
            <img class="img" width="150" :src="i.imgArr[0]" alt="">
            <div class="mx">
              <p style="font-size: 14px;">{{i.name}}</p>
              <span style="color: red;font-size: 18px;">￥{{i.jg}}</span><span style="font-size: 12px;color: #DCDCDC;padding-left: 0.5rem;">{{i.sales}}人付款</span>
            </div>
          </router-link>
        </div>
      </div>
      <div class="block_"></div>
      <div class="block" v-if="list.length === 2">
        <div class="sp" v-for="(i, j) in list[0].filter(this.js)" :key="j">
          <router-link :to="sp + i._id">
          <img class="img" width="150" :src="i.imgArr[0]" alt="">
          <div class="mx">
            <p style="font-size: 14px;">{{i.name}}</p>
            <span style="color: red;font-size: 18px;">￥{{i.jg}}</span><span style="font-size: 12px;color: #DCDCDC;padding-left: 0.5rem;">{{i.sales}}人付款</span>
          </div>
          </router-link>
        </div>
      </div>
    </div>
<div style="width: 100%;height: 0.5rem;clear: both;"></div>
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
  methods: {
    os (i, j) {
      return j % 2 === 0
    },
    js (i, j) {
      return j % 2 !== 0
    }
  },
  created () {
    this.axios.get(`${this.ip}/list`)
      .then(i => {
        this.list = i.data
      })
  }
}
</script>

<style lang="less" scoped="scoped">
  .Boutique{
    width: 90%;
    height: auto;
    clear: both;
    margin: 1rem auto;
    .block{
      width: 48%;
      float:left;
    }
    .block_{
      width: 2%;
      height: 1rem;
      float:left;
    }
    .img{
      width: 100%;
      // height: 200px;
    }
    .sp{
      background-color: #fff;
      border-radius: 5px;
      width: 100%;
      float: left;
      box-sizing: border-box;
      margin-top: 8%;
      margin-left: 2%;
      p{
        color: #000;
      }
      // padding-left: 1rem;
    }
    .mx{
      padding:0 1rem;
      p{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>
