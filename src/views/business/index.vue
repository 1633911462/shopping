<template>
  <div id="index">
    <!-- 商品名称、价格、商品图片（多个）、型号、分类 -->
    <input class="file" @change="htx()" accept="image/jpeg, image/png" ref="file" type="file">
    <img ref="tx" :src="this.$store.state.me.url ? this.$store.state.me.url : require('@/assets/xing.png')" width="100" alt="" height="100">
    <h3>{{dpName}}</h3>
    <router-link to="/me">
      <div class="blo">主页</div>
    </router-link>
    <div class="blo" @click="yes">添加商品</div>
    <router-link to="/mySp">
      <div class="blo">商品列表</div>
    </router-link>
    <router-link to="/shopOrder">
      <div class="blo">店铺订单</div>
    </router-link>
    <router-link to="/dpMsg">
      <div class="blo">店铺消息<p class="right" v-if="msgNum">{{msgNum}}</p></div>
    </router-link>
    <router-link to="/chat?root=true&dp=true">
      <div class="blo">联系客服</div>
    </router-link>
    <!-- 遮罩层 -->
    <div class="zz" ref="zz"></div>
    <!-- 添加商品 -->
    <div class="add" ref="add">
      <div v-if="index">
        <span>商品名称</span><input v-model="formData.name" type="text"><br>
        <p>*商品名称不能为空</p>
        <span>商品价格</span><input v-model="formData.jg" type="number" placeholder="单位默认元"><br>
        <p>*商品价格不能为空</p>
        <span>款式尺码</span><input v-model="formData.size" type="text"><br>
        <p>*款式尺码不能为空</p>
        <label for="">*请采用（S,M,L,XL）或（28,29,30）的格式</label>
        <br>
        <span>分类</span>
        <select v-model="formData.type" name="" id="">
          <option value="请选择">请选择</option>
          <option v-for="(i, j) in type" :key="j" :value="i">{{i}}</option>
        </select><br>
        <p>*商品分类不能为空</p>
      </div>
      <!-- 选择图片了 -->
      <div v-if="!index">
        <img v-for="(i, j) in img" :key="j" width="31%" height="100" :src="i" alt="" style="margin:0 0.3rem 1rem 0;display: block;float: left;">
        <div style="width:33.3%;height:100px;float: left;position: relative;">
          <input type="file" class="file1" ref="file" @change="addImg()" accept="image/*" name="file">
          <div class="Aimg">+</div>
        </div>
      </div>
      <div style="width: 100%;height: 1px;clear: both;"></div>
      <button ref="tj" style="margin-left: 5rem;" @click="add()">下一步</button>
      <button @click="no()">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgList: new FormData(),
      index: true,
      num: 0,
      img: [],
      msgNum: null,
      formData: {
        name: '',
        jg: '',
        size: '',
        type: '请选择'
      },
      dpName: '店铺名',
      type: []
    }
  },
  mounted () {
    if (this.$store.state.me.type === 'xf') {
      // 消费者，进入申请页面
      this.$router.push('/apply')
      return ''
    } else {
      this.$root._that = this
      this.initMsg()
      this.getDp()
    }
  },
  methods: {
    initMsg () {
      if (this.$root.dpMsg) {
        this.msgNum = this.$root.dpMsg
      }
    },
    // 选择图片
    addImg () {
      var file = this.$refs.file
      var url = URL.createObjectURL(file.files[0])
      this.img.push(url)
      this.imgList.append('file', file.files[0])
      this.num++
    },
    no () {
      this.formData.name = ''
      this.formData.jg = ''
      this.formData.size = ''
      this.formData.type = '请选择'
      this.$refs.add.style.display = 'none'
      this.$refs.zz.style.display = 'none'
      this.img = []
      this.num = 0
      this.imgList = ''
      this.imgList = new FormData()
      this.index = true
    },
    add () {
      if (this.num === 0) {
        var is = this.is(this.formData.name, this.formData.jg, this.formData.size, this.formData.type)
        // 进入下一步
        if (is) {
          this.num++
          this.index = false
          this.$refs.tj.innerText = '提交'
          this.$refs.add.classList.add('imgX')
        }
      } else if (this.num === 1) {
        alert('请选择图片')
      } else {
        // 添加商品了
        var date = new Date().toLocaleString()
        var sales = 0
        this.formData.date = date
        this.formData.sales = sales
        this.imgList.append('sp', JSON.stringify(this.formData))
        this.imgList.append('user', this.$store.state.me.user)
        this.axios.post(`${this.ip}/addSp`, this.imgList)
        this.no()
        alert('商品添加成功！')
      }
    },
    yes () {
      this.$refs.add.style.display = 'block'
      this.$refs.zz.style.display = 'block'
    },
    // 换头像
    htx () {
      var formData = new FormData()
      formData.append('file', this.$refs.file.files[0])
      formData.append('user', JSON.stringify({
        user: this.$store.state.me.user,
        password: this.$store.state.me.password
      }))
      this.axios.post(`${this.ip}/htx`, formData)
      this.$refs.tx.src = URL.createObjectURL(this.$refs.file.files[0])
    }
  }
}
</script>

<style lang="less" scoped>
.right{
        @px: 20px;
        text-align: center;
        line-height: 20px;
        color:#fff;
        width: @px;
        height: @px;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        opacity: 1;
        right: 1rem;
        font-size: 14px;
        background: red;
        border-radius: 50%;
      }
  @width: 100%;
  .file1{
    opacity: 0;
    width: @width !important;
    height: @width !important;
    margin-top: 1rem !important;
    position: relative;
    z-index: 99;
  }
  .Aimg{
    background-color: #dedede;
    color: #999;
    position: absolute;
    top:0;
    text-align: center;
    line-height: 100px;
    font-size: 50px;
    width: @width;
    height: @width;
  }
  .ya{
    animation: 0.5s TExt linear;
  }
  @keyframes TExt{
    0%{
      transform:scale(1);
    }
    50%{
      transform:scale(1.5);
    }
    100%{
      transform:scale(1);
    }
  }
  p{
    color:red;
    transition: all 2s;
    font-size:15px;
    opacity: 0;
  }
  button{
    width: 20%;
    height: 30px;
    border: 0px;
    margin-left:1rem;
    margin-top: 1rem;
    border-radius: 12px;
    clear: both;
  }
  .zz{
    display: none;
    width: 100%;
    height: 1000px;
    background-color: #000;
    opacity: 0.5;
    position: fixed;
    top:0;
  }
  .imgX{
    left: 0 !important;
    transform: translate(0, -50%) !important;
    width: 100% !important;
    box-sizing: border-box;
  }
  .add{
    // text-align: center;
    display: none;
    position: fixed;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.5rem 1rem;
    background-color:#55aaff;
    border-radius: 15px;
    width: 80%;
    input{
      border: 0px;
      height: 2rem;
      font-size: 1rem;
      width: 80%;
      border-radius: 7px;
      margin-top: 1.5rem;
    }
    select{
      width: 5rem;
      height: 2rem;
    }
    span{
      font-size:12px;
    }
    label{
      font-size:8px;
      color:red;
    }
  }
  h3{
    display: inline-block;
    font-size: 30px;
  }
  .blo{
    width: 80%;
    height: 40px;
    margin:2rem auto;
    text-align: center;
    line-height: 40px;
    background-color: #fff;
    border-radius: 12px;
    position: relative;
  }
  a{
    color: #000;
  }
  .file{
    position: absolute;
    top:0;
    left: 0;
    z-index: 99;
    width: 100px;
    height: 100px;
    border: 0px;
    box-sizing: border-box;
    opacity: 0;
  }
</style>
