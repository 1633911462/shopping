<template>
  <div id="password">
    <label for="">账号：</label><input v-model="user" type="text">
    <p>*账号不能为空</p>
    <div v-if="isYzm">
      <label for="">旧密码：</label><input v-model="oldPassword" type="password">
      <p>*旧密码不能为空</p>
    </div>
    <label for="">新密码：</label><input v-model="newPassword" type="password">
    <p>*新密码不能为空</p>
    <div v-if="!isYzm">
      <input placeholder="邮箱验证码..." v-model="mailYzm" class="mail" type="text">
      <div ref="mailYzm" class="mailYzm" @click="send()">发送验证码</div>
      <p ref="">*验证码错误或为空</p>
    </div>
    <div v-show="isYzm">
      <input v-model="yzm" maxlength="4" style="width: 80px;" type="text">
      <div class="yzm" @click="ranNum()" ref="yzm">加载中...</div>
      <p ref="k">*验证码错误或为空</p>
    </div>
    <button ref="wj" @click="wj()">忘记密码</button>
    <button @click="xgPass()">修改密码</button>
    <button @click="$router.push('/login')">返回页面</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      oldPassword: '',
      newPassword: '',
      mailYzm: '',
      yzm: '',
      key: true,
      isYzm: true
    }
  },
  mounted () {
    this.ranNum()
  },
  methods: {
    wj () {
      if (this.isYzm) {
        this.isYzm = false
        this.$refs.wj.innerHTML = '原密码修改'
      } else {
        this.isYzm = true
        this.$refs.wj.innerHTML = '忘记密码'
      }
    },
    send () {
      if (this.key) {
        // 属于邮箱格式
        this.axios.post(`${this.ip}/email`, {
          user: this.user
        }).then(i => {
          if (!i.data) {
            alert('账号未注册')
          }
        })
        this.$refs.mailYzm.classList.add('sendMail')
        this.key = false
        this.time(60, this.$refs.mailYzm)
      }
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
    xgPass () {
      if (!this.isYzm) {
        // 邮箱修改密码
        var is = this.is(this.user, this.newPassword, this.mailYzm)
        if (is) {
          this.axios.post(`${this.ip}/updatePass`, {
            user: this.user,
            newPassword: this.newPassword,
            mailYzm: this.mailYzm
          })
            .then(i => {
              if (i.data === '成功') {
                alert('修改成功')
                this.user = ''
                this.oldPassword = ''
                this.newPassword = ''
                this.yzm = ''
                this.$router.push('/login')
              } else if (i.data === '错误') {
                alert('验证码错误')
                this.mailYzm = ''
              } else if (i.data === '未收到') {
                alert('未收到验证码')
              }
            })
        } else {
          this.ranNum()
        }
      } else {
        // 原密码修改
        is = this.is(this.user, this.oldPassword, this.newPassword, this.yzm)
        if (this.yzm !== this.$refs.yzm.innerHTML) {
          this.$refs.k.style.opacity = 1
          is = false
        }
        if (is) {
          this.axios.post(`${this.ip}/updatePass`, {
            user: this.user,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          })
            .then(i => {
              if (i.data) {
                alert('修改成功')
                this.user = ''
                this.oldPassword = ''
                this.newPassword = ''
                this.yzm = ''
                this.$router.push('/login')
              } else {
                alert('密码错误')
                this.oldPassword = ''
                this.newPassword = ''
                this.yzm = ''
              }
            })
        } else {
          this.ranNum()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .ya{
    animation: 0.5s TExt linear;
  }
  .mail{
    width: 40% !important;
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
  #password{
    width: 100%;
    height: auto;
    text-align: center;
    margin: 0 auto;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    font-size: 18px;
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
  }
</style>
