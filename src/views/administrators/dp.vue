<template>
  <div id="dp">
    <adminHead>店铺审核</adminHead>
    <div class="clear" @click="clear()">清空已处理审核</div>
    <p v-if="!list[0]" style="text-align: center;margin-top: 50%;">还没有店铺审核哦</p>
    <div class="block" v-for="(i, j) in list" :key="j">
      <pre>姓    名：<span>{{i.name}}</span></pre>
      <pre>用 户 名：<span>{{i.user}}</span></pre>
      <pre>店 铺 名：<span>{{i.dpName}}</span></pre>
      <pre>商品类别：{{i.type}}</pre>
      <div v-if="!i.result">
        <button @click="result(i, 'yes')" class="yes">同意</button>
        <button @click="result(i, 'no')" class="no">拒绝</button>
      </div>
      <div v-if="i.result" style="float:right;color: red;margin-top:0.6rem;">{{i.result}}</div>
    </div>
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
export default {
  data () {
    return {
      list: ''
    }
  },
  created () {
    this.getList()
  },
  components: { adminHead },
  methods: {
    getList () {
      this.axios.get(`${this.ip}/examine?type=dp`)
        .then(i => {
          this.list = i.data
          this.list.reverse()
        })
    },
    result (i, result) {
      this.axios.post(`${this.ip}/result?dp=${result}`, i)
        .then(i => {
          if (i.data === '重复审核') {
            alert('该店铺已审核完成，刷新后重试')
            this.$router.go(0)
          } else if (i.data === 'ok') {
            this.$router.go(0)
          }
        })
    },
    clear () {
      this.axios.get(`${this.ip}/clear?type=dp`)
        .then(i => {
          this.getList()
          alert('已清空')
        })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .clear{
    margin:1rem 0 0 2.7rem;
    border-radius: 15px;
    background-color: #5ab2ff;
    border: 0px;
    text-align: center;
    position: absolute;
    right: 1rem;
    bottom: 4rem;
    width: 150px;
    height: 40px;
    line-height: 40px;
  }
  #dp{
    width: 100%;
    .block{
      width: 80%;
      margin: 1rem auto;
      height: auto;
      min-height: 150px;
      padding: 1rem;
      background-color: #fff;
      border-radius: 14px;
      box-shadow: 0 0 2px steelblue;
      line-height: 1.7rem;
      pre{
        font-size: 16px;
        color:#000;
        span{
          font-size: 20px;
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }
      }
      button{
        margin:1rem 0 0 2.7rem;
        border-radius: 15px;
        background-color: #5ab2ff;
        border: 0px;
        width: 80px;
        height: 40px;
        line-height: 40px;
      }
      .no{
        background-color: #4f8021;
      }
      .yes{
        background-color: #00aaff;
      }
    }
  }
</style>
