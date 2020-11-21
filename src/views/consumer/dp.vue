<template>
  <div style="height: 100%;">
    <div class="header">
      <img width="150" height="150" style="border-radius: 50%;" :src="dp.url" alt="" />
      <div>
        <p style="font-size: 20px;">
          {{dp.dpName}}
        </p>
        <div>
          <div style="margin-left: 25%;">粉丝数：{{dp.fans ? dp.fans.length || 0 : 0}}</div>
          <div class="gz" @click="gz">{{isFollow !== -1 ? '已关注' : '关注'}}</div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="nav">
        <ul>
          <li class="type" @click="flter('count', 0)" index="0">全部商品</li>
          <li class="type" @click="flter(i, j + 1)" :index="j + 1" v-for="(i, j) in type" :key="j">
            {{i}}
          </li>
        </ul>
      </div>
      <div style="height: 100%;">
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
    </div>
    <div class="exit" @click="$router.go(-1)">返回</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 店铺的商品列表
      list: [],
      list1: [],
      index: 0,
      // 店铺信息
      dp: {},
      type: '',
      // 是否关注
      isFollow: -1,
      timer: false
    }
  },
  watch: {
    index: {
      handler (newValue) {
        this.$nextTick(() => {
          var dom = document.getElementsByClassName('type')
          for (var i = 0; i < dom.length; i++) {
            dom[i].classList.remove('active')
          }
          dom[newValue].classList.add('active')
        })
      },
      immediate: true
    }
  },
  created () {
    this.getMsg()
  },
  methods: {
    flter (i, j) {
      this.index = j
      if (i === 'count') {
        this.list = this.list1
        return ''
      }
      this.list = this.list1.filter(j => {
        return j.type === i
      })
    },
    getMsg () {
      // 店铺的商品列表
      this.axios.get(`${this.ip}/spList?user=${this.$route.params.id}`)
        .then(i => {
          this.list = i.data
          this.list1 = i.data
        })
      // 店铺的信息
      this.axios.post(`${this.ip}/myDp`, {
        user: this.$route.params.id
      })
        .then(i => {
          this.dp = { ...this.dp, ...i.data }
          this.type = this.dp.type.split(',')
          if (this.type.length === 1) {
            this.type = this.dp.type.split('，')
          }
        })
      // 头像
      var a = this.getMe({ user: this.$route.params.id })
      a.then(i => {
        this.$set(this.dp, 'url', i.url)
      })
      // 获取我的个人信息
      var b = this.getMe()
      b.then(i => {
        if (i.follow) {
          setTimeout(() => {
            this.isFollow = i.follow.indexOf(this.dp.dpName)
          }, 10)
        } else {
          this.isFollow = -1
        }
      })
    },
    gz () {
      var num = 1
      if (this.isFollow !== -1) {
        num = -1
        this.isFollow = -1
        var index = this.dp.fans.indexOf(this.$store.state.me.user)
        this.dp.fans.splice(index, 1)
      } else {
        this.isFollow = 1
        if (!this.dp.fans) {
          this.dp.fans = []
        }
        this.dp.fans.push(this.$store.state.me.user)
      }
      if (this.timer !== false) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.axios.post(`${this.ip}/fs`, {
          dpName: this.dp.dpName,
          num: num,
          user: this.$store.state.me.user
        })
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .active{
    background-color: #ffaa00;
  }
  .exit{
    a{
      color: #fff;
    }
    width: 5rem;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    position: absolute;
    top: 1rem;
    left:15%;
    z-index:999;
    transform: translateX(-50%);
    background-color: #ff5500;
  }
  .body{
    clear: both;
    margin-top: 8rem;
    height: 100%;
    text-align: center;
    width: 100%;
    .nav{
      // height: 40px;
      ul{
        height: 100%;
        li{
          float:left;
          line-height: 40px;
          height: 100%;
          width: 25%;
          border:1px solid #ccc;
          box-sizing: border-box;
          list-style: none;
        }
      }
    }
    .block{
      clear: both;
      width: 100%;
      height: 20%;
      padding-top: 0.5rem;
      div{
        width:45%;
        float:left;
        font-size:18px;
        box-sizing: border-box;
        height: 100%;
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
  }
  .header{
    width: 100%;
    height: 150px;
    padding-top:1rem;
    text-align: center;
    div{
      p{
        padding: 1rem;
      }
      div{
        div{
          float:left;
          line-height: 30px;
        }
        .gz{
          margin-left: 1rem;
          width: 80px;
          height: 30px;
          line-height: 30px;
          background-color: #ffaa00;
          color:#fff;
          border-radius: 7px;
        }
      }
    }
  }
</style>
