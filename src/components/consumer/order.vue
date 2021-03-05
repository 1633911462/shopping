<template>
  <div id="order">
    <div class="sp" @click="myMsg(i)" v-for="(i, j) in list" :key="j">
      <p>
        <span v-if="type === 'dpName'">{{i.userName}}({{i.user}})</span>
        <span v-if="type === 'user'">{{i.dpName}}</span>
        <span v-if="type === 'root'">{{i.dpName}}</span>
        <span style="float:right;color: #FF0000;">交易成功</span>
      </p>
      <div style="margin: 0.5em;position: relative;z-index:0;">
        <div style="float: left;width: 35%;">
          <img width="100" height="100" v-if="i.imgArr" :src="i.imgArr[0]" alt="">
        </div>
        <div style="width:50%;float: left;padding-left:0.5rem;line-height: 30px;">
          <p v-if="i.name">{{i.name}}</p>
          <p>{{i.size}}</p>
          <p>订单备注：{{i.bz || '无'}}</p>
        </div>
        <div style="position: absolute;right:0;top:0.5rem;text-align: right;">
          <p>￥{{i.jg}}</p>
          <p>x{{i.num}}</p>
        </div>
      </div>
      <p style="position: absolute;right: 0.2rem;bottom:0.2rem;">
        <span v-if="type === 'root'">{{i.userName}}  </span>{{i.date}}<span v-if="type === 'root'"> 购买</span>
      </p>
    </div>
    <div class="msg" v-if="this.active">
      <h3 style="text-align: center;">订单收货信息</h3>
      <p style="margin-top: 1rem;">收货人姓名：{{active.name}}</p>
      <p>手机号码：{{active.number}}</p>
      <p>地址：{{active.address}}</p>
    </div>
    <div class="zzc" @click="active = null" v-if="this.active"></div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'user'
    }
  },
  data () {
    return {
      list: [],
      active: null
    }
  },
  methods: {
    // 收货信息
    myMsg (i) {
      this.active = i.address
    },
    getList () {
      // ；获取订单
      if (this.msg) {
        this.axios.get(`${this.ip}/order`)
          .then(i => {
            if (i.data) {
              if (this.type === 'root') {
                for (var k of i.data) {
                  this.list.push(k)
                }
              } else {
                for (var j of i.data) {
                  if (j[this.type] === this.msg) {
                    this.list.push(j)
                  }
                }
              }
              this.list.sort((a, b) => {
                if (a > b) {
                  return 1
                } else {
                  return -1
                }
              })
            }
          })
      } else {
        setTimeout(() => {
          this.getList()
        }, 20)
      }
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style lang="less" scoped="scoped">
  #order{
    width: 100%;
    height: 100%;
    .sp{
      background: #fff;
      width: 80%;
      border-radius: 12px;
      box-shadow: 0px 0px 2px 1px blue;
      margin: 1rem auto;
      padding: 0.5rem;
      min-height: 150px;
      position: relative;
    }
    .msg{
      position: fixed;
      border-radius: 17px;
      padding: 1rem;
      font-size: 18px;
      top:50%;
      left:50%;
      width: 80%;
      min-height: 200px;
      background-color: #fff;
      transform: translate(-50%,-50%);
      z-index: 999;
      p{
        line-height: 30px;
      }
    }
    .zzc{
      background-color: #ccc;
      opacity: 0.6;
      width: 100%;
      height: 100%;
      position: fixed;
      top:0;
      left:0;
      z-index: 9;
    }
  }
</style>
