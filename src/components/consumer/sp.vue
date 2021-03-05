<template>
  <div id="sp">
    <h3><span @click="$router.go(-1)" style="position: absolute;right: 1rem;">返回</span>查看宝贝</h3>
    <div class="imgArr" @touchmove="gd">
      <img width="100%" :index="j + 1" height="100%" :src="i" alt="" v-for="(i, j) in msg.imgArr" :key="j">
      <div class="index">{{num}}/{{msg.imgArr?msg.imgArr.length:1}}</div>
    </div>
    <div class="msg">
      <p class="p" style="color: red;">￥{{msg.jg}}<span style="float:right;color:#999;">销量{{msg.sales}}</span></p>
      <p class="name">{{msg.name}}</p>
    </div>
    <div class="gm">
      <router-link :to="'/dpIndex/' + msg.user"><div style="color: #000;">店铺</div></router-link>
      <div @click="$router.push(`/chat?user=${msg.dpName}`)">客服</div>
      <div @click="yes">购物车</div>
      <div @click="yes(1)">立即购买</div>
    </div>
    <!-- 遮罩层和弹窗 -->
    <div class="zzc" @click="no"></div>
    <div class="size">
      <div v-for="(i, j) in size" :key="j"><span @click="active">{{i}}</span></div>
      <button @click="add">{{type}}</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: '加入购物车',
      msg: {},
      num: 1,
      size: '',
      gwc: ''
    }
  },
  methods: {
    // 获取图片的索引数字
    imgNum (i) {
      var a = '' + i
      a = a.split('')
      if (parseInt(a[2]) >= 9 && a[0] !== a[this.msg.imgArr.length - 1]) {
        a[0]++
        a[0]++
        return a[0]
      } else if (parseInt(a[2]) <= 0 && a[0] !== '0') {
        a[0]++
        return a[0]
      } else if (!a[2]) {
        return parseInt(a[0]) + 1
      }
    },
    result () {
      this.msg.size = this.gwc
      this.msg.num = 1
      document.cookie = 'address=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = `spList=${JSON.stringify(this.msg)}`
      this.$router.replace('/payment')
    },
    // 将图片索引放上去
    gd (i) {
      var target = i.target
      this.num = this.imgNum(target.parentNode.scrollLeft / target.offsetWidth) || this.num
    },
    // 弹窗
    yes (num) {
      if (num && num === 1) {
        this.type = '立即购买'
      } else {
        this.type = '加入购物车'
      }
      document.getElementsByClassName('size')[0].style.display = 'block'
      document.getElementsByClassName('zzc')[0].style.display = 'block'
    },
    // 点击其他地方，弹窗关闭
    no () {
      document.getElementsByClassName('size')[0].style.display = 'none'
      document.getElementsByClassName('zzc')[0].style.display = 'none'
    },
    add () {
      if (this.gwc) {
        if (this.type === '立即购买') {
          this.result()
          return ''
        }
        this.axios.post(`${this.ip}/addGwc`, {
          id: this.msg._id,
          user: this.$store.state.me.user,
          num: 1,
          type: this.gwc
        })
        this.no()
        alert('成功加入购物车！')
      } else {
        alert('请选择商品属性')
      }
    },
    // 选择尺码类型
    active (i) {
      var doms = i.target.parentNode.parentNode.children
      for (var j = 0; j < doms.length; j++) {
        if (doms[j].children[0]) {
          doms[j].children[0].classList.remove('active')
        }
      }
      i.target.classList.add('active')
      this.gwc = i.target.innerText
    }
  },
  mounted () {
    var user = JSON.parse(atob(localStorage.userName)).user
    this.axios.get(`${this.ip}/addHistory?id=${this.$route.params.id},${user}`)
    this.axios.get(`${this.ip}/sp?id=${this.$route.params.id}`)
      .then(i => {
        this.msg = i.data
        this.size = this.msg.size.split(',')
        if (!this.size[1]) {
          this.size = this.msg.size.split('，')
        }
      })
  }
}
</script>

<style lang="less" scoped="scoped">
  .active{
    border: 1px solid #FF0000;
    color: #FF0000;
  }
  .size{
    width:80%;
    display: none;
    border-radius: 12px;
    height: 20rem;
    background: #fff;
    position: fixed;
    top:50%;
    text-align: center;
    left:50%;
    transform: translate(-50%, -50%);
    button{
      background-color: #ff0000;
      border-radius: 12px;
      font-size: 18px;
      color:#fff;
      text-align: center;
      line-height:50px;
      width: 90%;
      margin: 40% auto;
      display: block;
      border: 0px;
    }
    div{
      margin-top:3rem;
      padding: 1rem;
      display: inline-block;
      span{
        background-color: #ececec;
        font-size: 18px;
        padding: 0.5rem 1rem;
      }
    }
  }
  .zzc{
    width:100%;
    height:100%;
    display: none;
    position: fixed;
    top:0;
    left:0;
    background: #000;
    opacity:0.7;
  }
  .p{
    padding: 0.5rem 0.5rem 0 0;
  }
  .name{
    font-weight: bold;
    font-size: 20px;
    text-align: center;
  }
  .gm{
    background-color: #fff;
    width: 100%;
    border-top: 0.1px solid #999;
    position: absolute;
    bottom: 0;
    height: 9%;
    div{
      margin-left: 1.5rem;
      float:left;
      box-sizing: border-box;
      text-align: center;
      border:0.5px solid;
      padding: 0 0.5rem;
      height: 50px;
      line-height: 50px;
      position: relative;
      top:50%;
      transform: translateY(-50%);
      border-radius: 12px;
    }
  }
  .msg{
    background: #fff;
    width: 95%;
    height: 10%;
    margin:0.8rem auto;
    border-radius: 12px;
  }
  h3{
    text-align: center;
    display:block;
    width: 100%;
    height: 7%;
    line-height: 50px;
    background-color: #fff;
    a{
      color:#000;
    }
  }
  #sp{
    width: 100%;
    height: 100%;
  }
  .imgArr{
    width: 100%;
    overflow-x:scroll;
    // margin-top: 1rem;
    height: 70%;
    display: flex;
    img{
      flex:0 0 100%;
      /* object-fit: contain; */
    }
    .index{
      position: absolute;
      right: 1rem;
      bottom:27%;
      width: 3rem;
      height: 1.5rem;
      background-color: #000;
      color:#fff;
      border-radius: 12px;
      text-align: center;
      line-height: 1.5rem;
      opacity: 0.5;
    }
  }
</style>
