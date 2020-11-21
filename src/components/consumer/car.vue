<template>
  <div id="car">
    <div class="head">
      <h3>购物车({{list.length}})</h3>
      <p class="update" @click="update">{{update_}}</p>
    </div>
    <!-- 购物车列表 -->
    <div class="list" v-for="(i, j) in list" :key="j">
      <div class="title">
        <span>{{i.dpName}}</span>
      </div>
      <div class="sp">
        <input :value="i" v-model="active" style="float: left;margin-top: 35px;" type="checkbox" class="yuan">
        <img width="100" :src="i.imgArr[0]" alt="">
        <div class="msg">
          <p class="name">{{i.name}}</p>
          <div class="style">{{i.size}}</div><br>
          <p class="jq">￥{{i.jg}}</p>
          <div class="num">
            <div @click="num(i, '-')">-</div>
            <div class="num_i">{{i.num}}</div>
            <div @click="num(i, '+')">+</div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%;height: 50px;"></div>
    <div class="footer">
      <div class="f_l">
        <input @change="xz" v-model="isTrue" :value="isTrue" type="checkbox" class="yuan">
        <span>全选</span>
      </div>
      <div class="f_r" v-if="this.update_ === '管理'">
        合计：<span>￥{{count}}</span>
        <div @click="result">结算</div>
      </div>
      <div class="f_r" v-if="this.update_ !== '管理'">
        <span style="opacity:0;width: 7rem;">合计：￥{{count}}</span>
        <div @click="open">删除</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      update_: '管理',
      list: [],
      active: [],
      isTrue: false,
      timer: false
    }
  },
  computed: {
    count () {
      var active = this.active
      var count = 0
      for (var i of active) {
        count += i.jg * i.num
      }
      if (this.list.length === active.length) {
        this.xz(true)
      } else {
        this.xz(false)
      }
      return count
    }
  },
  methods: {
    update () {
      if (this.update_ === '管理') {
        this.update_ = '完成'
      } else {
        this.update_ = '管理'
      }
    },
    // 删除
    open () {
      if (this.active.length < 1) {
        return false
      }
      this.$confirm(`确认将这${this.active.length}个宝贝删除?`, {
        confirmButtonText: '删除',
        cancelButtonText: '我再想想',
        type: 'warning'
      }).then(() => {
        this.axios.post(`${this.ip}/delGwc`, this.active)
          .then(i => {
            this.getList()
          })
      })
    },
    // 支付
    result () {
      if (this.active.length < 1) {
        return false
      }
      document.cookie = 'address=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = `spList=${JSON.stringify(this.active)}`
      this.$router.push('/payment')
    },
    num (i, j) {
      if (j === '+') {
        i.num++
      } else {
        if (i.num === 0 || i.num === 1) {
          return ''
        }
        i.num--
      }
      if (this.timer !== false) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.axios.post(`${this.ip}/gwcNum`, {
          num: i.num,
          _id: i._id
        })
        this.timer = false
      }, 500)
    },
    xz (i) {
      if (i === true || i === false) {
        this.isTrue = i
        return ''
      }
      if (this.isTrue) {
        // 全选
        this.active = this.list
      } else {
        // 取消全选
        this.active = []
      }
    },
    getList () {
      if (this.$store.state.me.user) {
        this.axios.get(`${this.ip}/gwc?user=${this.$store.state.me.user}`)
          .then(i => {
            this.list = i.data
            this.list = i.data.sort((a, b) => {
              if (a.date > b.date) {
                return -1
              } else {
                return 1
              }
            })
            console.log(this.list)
          })
      } else {
        setTimeout(() => {
          this.getList()
        }, 20)
      }
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
  .update{
    position: fixed;
    right: 1rem;
    top:0;
  }
  .footer{
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    bottom:50px;
    background-color: #fff;
    .f_l{
      width: 35%;
      position: relative;
      float:left;
      input{
        position: absolute;
        top:50%;
        left:10px;
        transform: translateY(-50%);
      }
      span{
        margin-left: 40px;
      }
    }
    .f_r{
      width: 65%;
      float:left;
      span{
        color:#ff5500;
        margin-right: 1rem;
        width: 4rem;
        display: inline-block;
      }
      div{
        width: 100px;
        height: 40px;
        line-height: 40px;
        color:#fff;
        text-align: center;
        background-color: #ff5500;
        display: inline-block;
        border-radius: 25px;
      }
    }
  }
  .head{
    position: sticky;
    top:0px;
    z-index:1;
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #f1f1f0;
    border-bottom: 1px solid #fff;
    h3{
      display: inline;
    }
  }
  .list{
    width: 86%;
    height: auto;
    margin: 1rem auto;
    background-color: #fff;
    padding: 1rem 0 1rem 1rem;
    border-radius: 12px;
    .title{
      position: static;
      top:0;
      span{
        padding-left: 2rem;
        font-size:18px;
        color: #000;
        font-weight: 700;
      }
    }
    .sp{
      height: 100px;
      margin-top: 0.5rem;
      padding-bottom: 0.5rem;
      img{
        margin-left: 0.5rem;
        float: left;
        height: 100%;
      }
      .msg{
        float: left;
        box-sizing: border-box;
        margin-left: 1rem;
        width:50%;
        .name{
          width: 100%;
          font-size: 14px;
        }
        .jq{
          color: #ff5500;
          font-size: 19px;
          margin-top: 0.5rem;
          display: inline-block;
        }
        .style{
          margin-top: 0.5rem;
          background-color: #f3f3f3;
          display: inline-block;
          padding:0.2rem 0.5rem;
          border-radius: 2px;
        }
        .num{
          box-sizing: border-box;
          margin-left: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 7px;
          width: 100px;
          height: 30px;
          display: inline-block;
          float:right;
          box-sizing: border-box;
          line-height: 30px;
          text-align: center;
          div{
            float:left;
            width: 25%;
            box-sizing: border-box;
            height: 100%;
          }
          .num_i{
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            border:1px solid #ccc;
            border-top:0px;
            border-bottom: 0px;
          }
        }
      }
    }
  }
  .yuan:checked{
    background-color: #ff5500;
  }
  .yuan{
    width: 25px;
    height: 25px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    position: relative;
    -webkit-appearance: none;
    vertical-align: top;
    cursor: default;
    font-size: 0.8rem;
    transform:background-color ease 0.1s;
  }
  .yuan::after{
    content: '';
    display: block;
    transform: rotate(-45deg);
    width: 10px;
    height: 6px;
    position: absolute;
    // left:40px;
    top:5px;
    left:5px;
    background-color: transparent;
    border: 2px solid #fff;
    border-top:none;
    border-right: none;
  }
</style>
