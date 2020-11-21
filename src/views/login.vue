<template>
  <div id="login">
    <div v-if="isYzm">
      <label for="">头像：</label>
      <div class="tx" ref="tx">
        <input @change="htx()" accept="image/jpeg, image/png" ref="file" type="file">
        <img :src="this.url ? this.url : require('@/assets/xing.png')" width="100" height="100" alt="头像">
      </div>
      <br>
      <label for="">姓名：</label><input v-model="name" type="text">
      <p ref="name">*姓名超出字符或不能为空</p>
    </div>
    <label for="">账号：</label><input v-model="user" type="text">
    <p>*账号不能为空</p>
    <label for="">密码：</label><input v-model="password" type="password">
    <p>*密码不能为空</p>
    <div v-if="isYzm">
      <label for="">邮箱：</label><input v-model="mail" type="email">
      <p ref="mailP">*请输入正确的邮箱格式</p>
      <input placeholder="请输入验证码..." v-model="mailYzm" class="mail" type="text">
      <div ref="mailYzm" class="mailYzm" @click="send()">发送验证码</div>
      <p ref="">*验证码错误或为空</p>
    </div>
    <div v-show="!isYzm">
     <input v-model="yzm" maxlength="4" style="width: 80px;" type="text">
      <div class="yzm" @click="ranNum()" ref="yzm">加载中...</div>
      <p ref="k">*验证码错误或为空</p>
    </div>
    <button @click="login()">登录</button>
    <button @click="zc()">注册</button>
    <div @click="$router.push('/password')" style="font-size: 12px;color:red;margin-top: 1rem;">密码泄露？重置密码</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      user: '',
      password: '',
      yzm: '',
      mail: '',
      mailYzm: '',
      url: '',
      isYzm: false,
      key: 'true'
    }
  },
  mounted () {
    this.ranNum()
  },
  methods: {
    // 换头像实时预览
    htx () {
      this.url = URL.createObjectURL(this.$refs.file.files[0])
    },
    // 登录
    login () {
      if (this.isYzm === true) {
        this.name = ''
        this.user = ''
        this.password = ''
        this.mail = ''
        this.yzm = ''
        this.mailYzm = ''
        setTimeout(() => {
          this.ranNum()
        }, 20)
      }
      this.isYzm = false
      // is变量接收验证函数返回的值，判断是否为空
      this.$nextTick(() => {
        var is = this.is(this.user, this.password, this.yzm)
        // 不为空,进行下一步验证账号密码真实性
        if (is) {
          this.axios.post(`${this.ip}/isUser`, {
            user: this.user,
            password: this.password
          })
            .then(i => {
              if (i.data) {
                // 加密token
                localStorage.userName = window.btoa(JSON.stringify({
                  user: this.user,
                  password: this.password
                }))
                this.$router.push('/')
              } else {
                alert('账号或密码错误')
              }
            })
        }
      })
    },
    // 60秒后再试试
    time (num, dom) {
      dom.innerHTML = `请${num}秒后再试`
      num--
      if (num === -1) {
        dom.innerHTML = '发送验证码'
        this.$refs.mailYzm.classList.remove('sendMail')
        this.key = true
        return ''
      }
      setTimeout(() => {
        this.time(num, dom)
      }, 1000)
    },
    // 邮箱验证码
    send () {
      if (this.key) {
        this.$refs.mailP.style.opacity = 0
        var reyx = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        var ismail = reyx.test(this.mail)
        if (ismail) {
          // 属于邮箱格式
          this.axios.post(`${this.ip}/email`, {
            email: this.mail,
            user: this.user
          })
          this.$refs.mailYzm.classList.add('sendMail')
          this.key = false
          this.time(60, this.$refs.mailYzm)
        } else {
          this.$refs.mailP.style.opacity = 1
          this.$refs.mailP.classList.add('ya')
          setTimeout(() => {
            this.$refs.mailP.classList.remove('ya')
          }, 200)
        }
      }
    },
    // 注册
    zc () {
      if (this.isYzm === false) {
        this.name = ''
        this.user = ''
        this.password = ''
        this.mail = ''
        this.yzm = ''
        this.mailYzm = ''
      }
      this.isYzm = true
      this.$nextTick(() => {
        // is变量接收验证函数返回的值，判断是否为空
        var is = this.is(this.name, this.user, this.password, this.mail, this.mailYzm)
        if (this.getCharLength(this.name) > 8) {
          this.$refs.name.style.opacity = 1
          is = false
        }
        if (is) {
          // 提取文件
          var file = this.$refs.file
          var formData = new FormData()
          formData.append('file', file.files[0])
          formData.append('user', JSON.stringify({
            name: this.name,
            user: this.user,
            password: this.password,
            mail: this.mail,
            mailYzm: this.mailYzm,
            type: 'xf'
          }))
          // 请求注册接口
          this.axios.post(`${this.ip}/addUser`, formData)
            .then((i) => {
              if (i.data === '成功') {
                this.name = ''
                this.user = ''
                this.password = ''
                this.mail = ''
                this.mailYzm = ''
                alert('注册成功！')
                this.isYzm = false
              } else if (i.data === '存在') {
                alert('账号已经存在')
              } else if (i.data === '绑定') {
                alert('邮箱已经被绑定')
              } else if (i.data === '错误') {
                alert('验证码错误')
              } else if (i.data === '未收到') {
                alert('未收到验证码')
              }
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  img{
    border-radius: 50%;
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
  #login{
    width: 100%;
    height: auto;
    text-align: center;
    margin: 0 auto;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    font-size: 18px;
    .mail{
      width: 40%;
    }
    .sendMail{
      opacity: 0.5;
    }
    .mailYzm{
      margin-left: 0.5rem;
      display: inline-block;
      background: red;
      color: #fff;
      font-size: 14px;
      width: 100px;
      text-align: center;
      line-height: 40px;
      border-radius: 7px;
      line-height: 40px;
    }
    input{
      border-radius: 12px;
      border: 0;
      padding: 0.2rem;
      margin-top:1rem;
      height: 30px;
      width: 60%;
    }
    .yzm{
      width: 80px;
      border-radius: 12px;
      display: inline-block;
      height: 30px;
      padding: 0.2rem;
      text-align: center;
      margin-left: 1rem;
      margin-top:1rem;
      line-height: 30px;
      font-size: 20px;
      border: 1px solid #ccc;
    }
    p{
      color:red;
      transition: all 2s;
      font-size:15px;
      opacity: 0;
    }
    button{
      margin:1rem 0 0 1rem;
      border-radius: 15px;
      width: 80px;
      height: 40px;
      line-height: 40px;
    }
    .tx{
      position: relative;
      display: inline-block;
      width: 60%;
      height: 100px;
      overflow: hidden;
      top:1rem;
      text-align: center;
      input{
        position: absolute;
        top:0;
        left: 50%;
        transform:translateX(-50%);
        z-index: 99;
        width: 100px;
        height: 100px;
        border: 0px;
        box-sizing: border-box;
        opacity: 0;
      }
      img{
        position: absolute;
        z-index: 9;
        top:0;
       transform:translateX(-50%);
        left: 50%;
      }
    }
  }
</style>
