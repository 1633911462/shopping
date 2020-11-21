<template>
  <div id="payment">
      <div @click="fh" class="header">确认订单</div>
    <div class="msg" v-if="!this.address" @click="active">
      <p>点击选择地址</p>
    </div>
    <div class="msg" v-if="this.address" @click="active">
      <p>{{address.name}} <span style="color: #999;">{{address.number}}</span></p>
      <p style="font-size: 18px;line-height: 25px;">{{address.address}}</p>
    </div>
    <div class="sp" v-for="(i, j) in list" :key="j">
      <p style="line-height: 30px;">{{i.dpName}}</p>
        <img style="float: left;" width="100" height="100" :src="i.imgArr[0]" alt="">
        <div style="float: left;margin-left: 0.5rem;">
          <p>商品名称：{{i.name}}</p>
          <p>商品类型：{{i.size}}</p>
          <p>商品单价：￥{{parseFloat(i.jg)}}</p>
          <p>购买数量：{{i.num}}</p>
        </div>
        <div class="bz">
          <span>订单备注：</span>
          <input maxlength="30" v-model="i.bz" placeholder="选填,请先和商家协商一致" type="text">
        </div>
    </div>
    <div class="footer_"></div>
    <div class="footer">
      <span style="color: #999;">共1件，</span>
      <span>合计:</span>
      <span style="color:#FF0000;margin-right: 1rem;">￥{{count}}</span>
      <button @click="open">提交订单</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      to: '/car',
      list: [],
      address: '',
      count: 0
    }
  },
  methods: {
    fh () {
      this.$router.replace(this.to)
      // this.$router.go(-1)
    },
    active () {
      this.$router.replace('/address?active=true')
    },
    open () {
      if (!this.address) {
        alert('填写收货地址！')
        return false
      }
      this.$confirm('确认提交订单并支付?', '支付提醒', {
        confirmButtonText: '确认支付',
        cancelButtonText: '待会',
        type: 'warning'
      }).then(() => {
        document.cookie = 'spList=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
        // 删除购物车
        if (this.to === '/car') {
          this.axios.post(`${this.ip}/delGwc`, this.list)
        }
        // 添加订单了
        this.axios.post(`${this.ip}/addOrder`, {
          list: this.list,
          address: this.address,
          user: this.$store.state.me.user,
          userName: this.$store.state.me.name
        })
          .then(i => {
            this.$message({
              type: 'success',
              message: '支付成功！请前往我的-订单页面查看!'
            })
            this.$router.go(-1)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消支付'
        })
      })
    }
  },
  created () {
    if (!document.cookie) {
      alert('页面不存在，请检查浏览器cookie是否开启！')
      this.$router.replace('/')
    }
    // 商品信息
    var msg = JSON.parse(document.cookie.split(';')[0].split('spList=')[1])
    if (msg[0]) {
      msg.forEach(i => {
        this.list.push(i)
        this.count += parseFloat(i.jg)
      })
    } else {
      this.list[0] = msg
      this.count += parseFloat(msg.jg)
      this.to = `sp/${msg._id}`
    }
    // 收货地址
    this.axios.get(`${this.ip}/getAddress?user=${JSON.parse(atob(localStorage.userName)).user}`)
      .then(i => {
        for (var j in i.data) {
          if (document.cookie.split(';')[1]) {
            if (document.cookie.split(';')[1].split('address=')[1] === i.data[j]._id) {
              this.address = i.data[j]
            }
          } else {
            if (i.data[j].default) {
              this.address = i.data[j]
            }
          }
        }
      })
  }
}
</script>

<style lang="less" scoped="scoped">
  #payment{
    width: 100%;
    height:100%;
    background: #f6f6f6;
    .header{
      height: 50px;
      font-size: 20px;
      width: 30%;
      color: #000;
      line-height: 50px;
      margin-left: 50px;
    }
    .header::after{
      content: '';
      position: absolute;
      left:0;
      width: 50px;
      height: 40px;
      background-position: center center;
      background-size: cover;
      top:0;
      background-image: url(../../assets/exit.jpg);
    }
    .msg{
      width: 80%;
      margin:0.5rem auto;
      font-size:20px;
      background: #fff;
      padding:1rem 1rem;
      border-radius: 15px;
      p{
        line-height: 30px;
      }
    }
    .sp{
      width: 80%;
      margin:1rem auto;
      background: #fff;
      min-height: 180px;
      padding:1rem 0 1rem 1rem;
      border-radius: 15px;
      div{
        width: 50%;
        p{
          line-height: 30px;
          width:100%;
          text-overflow: ellipsis;
          white-space:nowrap;
          overflow: hidden;
        }
      }
      .bz{
        width: 100%;
        clear: both;
        margin-top:8rem;
        input{
          width:200px;
          border: 0px;
          color: #000;
          height: 30px;
        }
      }
    }
    // 遮罩
    .footer_{
      clear: both;
      width: 100%;
      height: 60px;
      position: sticky;
      bottom: 0;
    }
    .footer{
      width: 100%;
      height: 60px;
      line-height: 60px;
      background: #fff;
      position: fixed;
      bottom: 0;
      text-align: center;
      padding-left: 2rem;
      button{
        background-color: #ff5500;
        width: 100px;
        height:40px;
        color:#fff;
        border-radius: 20px;
        border: 0px;
      }
    }
  }
</style>
