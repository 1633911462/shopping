<template>
  <!-- 搜索框 -->
  <div class="search" @click="search">
    <input list="search" v-model="value" placeholder="vivo IQOO" type="search">
    <datalist id="search" v-if="list.length === 2">
      <option v-if="list[0][0]" :value="list[0][0].name" />
      <option v-if="list[0][1]" :value="list[0][1].name" />
      <option v-if="list[0][2]" :value="list[0][2].name" />
    </datalist>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    }
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    search (i) {
      if (i.target.classList.length === 1) {
        if (this.value.trim() === '' || this.$route.params.name === this.value) {
          return ''
        }
        this.$router.push('/search/' + this.value)
        this.value = ''
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  @height: 40px;
  .search{
    width: 80%;
    height: @height;
    margin: 0 auto;
    position: relative;
    input{
      padding-left: 1rem;
      height: @height;
      width: 100%;
      border: 2px solid #FF0000;
      border-radius: 25px;
      box-sizing: border-box;
    }
  }
  .search::before{
    content: '搜索';
    color: #fff;
    background-color: #FF0000;
    width: 70px;
    height: @height;
    text-align: center;
    line-height: @height;
    position: absolute;
    right: 0;
    border-radius: 25px;
  }
</style>
