var mixin = {
  data () {
    return {
      ip: 'http://120.25.215.239:7000'
    }
  },
  methods: {
    // 随机获取四位数字验证码
    ranNum () {
      this.$refs.yzm.innerHTML = Math.random().toString(32).split('.')[1].substring(0, 4)
    },
    // 获取字节长度
    getCharLength (str) {
      var leng = 0
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
          leng += 2
        } else {
          leng += 1
        }
      }
      return leng
    },
    // 验证是否为空
    is (...value) {
      var reg = /\s/g
      var p = document.getElementsByTagName('p')
      var is = true
      for (let i = 0; i < value.length; i++) {
        p[i].style.opacity = 0
        if (value[i].match(reg) || value[i] === '' || value[i] === '请选择' || value[i] === '0') {
          p[i].style.opacity = 1
          p[i].classList.add('ya')
          setTimeout(() => {
            p[i].classList.remove('ya')
          }, 500)
          is = false
        }
      }
      return is
    },
    async getMe (name) {
      let data = ''
      await new Promise((resolve, reject) => {
        this.axios.post(`${this.ip}/user`, name || JSON.parse(window.atob(localStorage.userName)))
          .then(i => {
            if (i.data) {
              if (!name) {
                this.$store.commit('addMe', i.data)
              }
              data = i.data
              resolve(data)
            } else {
              resolve('重新登录')
              this.$router.push('/login')
            }
          })
      })
      return data
    },
    // 店铺信息
    async getDp () {
      if (this.$store.state.me.user) {
        await new Promise((resolve, reject) => {
          this.axios.post(`${this.ip}/myDp`, {
            user: this.$store.state.me.user
          })
            .then(i => {
              if (i.data) {
                this.$store.commit('addmyDp', i.data)
                this.dpName = i.data.dpName
                this.type = i.data.type.split('，')
                if (this.type.length === 1) {
                  this.type = i.data.type.split(',')
                }
                resolve('成功')
              } else {
                resolve('暂未开通店铺')
              }
            })
        })
      } else {
        setTimeout(() => {
          this.getDp()
        }, 20)
      }
    }
  }
}
export default mixin
