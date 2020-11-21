<template>
  <div id="apply">
    <span class="title">店铺名称</span><input v-model="fromData.dpName" type="text"><br><br>
    <span class="title">掌柜名字</span>{{fromData.name}}<br><br>
    <span class="title">电子邮箱</span>{{fromData.mail}}<br><br>
    <span class="title">商品类型</span>
    <input type="text" v-model="fromData.type"><br>
    <label for="">*请采用（手机,电脑,手表）的格式填写(至少填写三项)，填写后不可更改，之后上架商品只能根据填写的分类发布。请谨慎填写！！！</label>
    <br><button @click="kt()">开通店铺</button>
    <router-link to="/me"><button>暂不开通</button></router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fromData: {
        dpName: '',
        name: '',
        user: '',
        mail: '',
        type: ''
      }
    }
  },
  methods: {
    // 开通店铺
    kt () {
      delete this.fromData._id
      delete this.fromData.url
      delete this.fromData.mail
      delete this.fromData.password
      this.axios.post(`${this.ip}/addDp`, this.fromData)
        .then(i => {
          if (i.data === '已开通') {
            alert('当前账号开通过店铺了！')
          } else if (i.data === '已存在') {
            alert('店铺名已经被注册过了！')
          } else if (i.data === '重复审核') {
            alert('请勿重新审核！')
          } else if (i.data === '审核中') {
            alert('您的申请已发送至后台审核中！')
          } else if (i.data === '已拒绝') {
            alert('您的申请被驳回，请检查店铺名是否合法，商品分类格式是否规范。')
          }
          this.$router.push('/me')
        })
    }
  },
  created () {
    var a = this.getMe()
    a.then(i => {
      if (i.type === 'xf') {
        this.fromData = i
        this.fromData.dpName = this.fromData.name + '的小店'
        this.fromData.type = ''
      } else {
        this.$router.push('/me')
      }
    })
  }
}
</script>

<style lang="less" scoped>
  #apply{
    color:#000;
    font-size: 1.3rem;
    width: 95%;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    input{
      height: 1.5rem;
      font-size: 1.3rem;
    }
    span{
      color:#474747;
      font-size: 1.2rem;
      padding-right: 1rem;
    }
    label{
      font-size: 1.2rem;
      color:red;
    }
    button{
      border-radius: 12px;
      width: 6rem;
      height: 3rem;
      margin: 2rem 0 0 3rem;
    }
  }
</style>
