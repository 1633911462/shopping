<template>
  <div id="addAddress">
    <adminHead :to="to">{{type}}</adminHead>
    <div class="add">
      收货人<input v-model="fromData.name" placeholder="收货人" maxlength="8" type="text">
      <p>收货人不能为空</p>
    </div>
    <div class="add">
      手机号码<input v-model="fromData.number" placeholder="手机号码" type="number">
      <p>手机号码不能为空</p>
    </div>
    <div class="add" v-if="this.type !== '编辑收货地址'">所在地区
      <v-region type="group" @values="values" :town="true"></v-region>
      <p>所在地区请填写完整</p>
    </div>
    <div class="add">
      详细地址<textarea v-model="fromData.address" cols="25" rows="3" placeholder="详细地址:如道路、门牌号、小区、楼栋号、单元室等"></textarea>
      <p>详细地址不能为空</p>
    </div>
    <div class="add" style="border: 0px;">
      设为默认地址
      <el-switch v-model="fromData.default">
      </el-switch>
    </div>
    <p style="width: 90%;margin: 0 auto;color: red;" v-if="this.type === '编辑收货地址'" type="text" @click="open">删除收货地址</p>
    <div class="bc" @click="add">保存</div>
    <!-- 确认删除弹出框 -->
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
export default {
  components: { adminHead },
  data () {
    return {
      to: '/address',
      type: '',
      msg: '',
      // 存放地区
      fromData: {
        user: JSON.parse(atob(localStorage.userName)).user,
        name: '',
        number: '',
        msg1: [],
        default: true,
        address: ''
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.query.active) {
        vm.to = from.path + '?active=' + from.query.active
      }
    })
  },
  created () {
    if (this.$route.query.msg) {
      if (!this.$route.query.msg.name) {
        this.$router.go(-1)
        return ''
      }
      this.type = '编辑收货地址'
      this.fromData = { ...this.$route.query.msg }
    } else {
      this.type = '添加收货地址'
    }
  },
  methods: {
    values (datas) {
      this.msg = datas
    },
    add () {
      // 保存地址
      var is = false
      if (this.type === '编辑收货地址') {
        is = this.is(this.fromData.name, this.fromData.number, this.fromData.address)
      } else {
        // 新增地址
        if (this.msg) {
          this.fromData.msg1 = []
        } else {
          this.fromData.msg1 = ['']
        }
        for (var i in this.msg) {
          if (!this.msg[i]) {
            this.fromData.msg1 = ['']
            break
          }
          this.fromData.msg1.push(this.msg[i].value)
        }
        is = this.is(this.fromData.name, this.fromData.number, this.fromData.msg1[0], this.fromData.address)
        this.fromData.address = this.fromData.msg1.join('') + this.fromData.address
      }
      if (is) {
        if (this.fromData.number.length !== 11) {
          alert('手机号码必须是11位数字')
        } else {
          delete this.fromData.msg1
          this.axios.post(`${this.ip}/address`, Object.assign(this.fromData, { type: this.type }))
            .then(i => {
              if (this.type === '编辑收货地址') {
                alert('修改地址成功！')
                this.$router.replace(this.to)
              } else {
                this.fromData.name = ''
                this.fromData.number = ''
                this.fromData.msg1 = []
                this.fromData.address = ''
                alert('添加地址成功！')
                this.$router.replace(this.to)
              }
            })
        }
      }
    },
    open () {
      this.$confirm('确定要删除该地址吗?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.axios.get(`${this.ip}/delAddress?_id=${this.fromData._id}`)
          .then(i => {
            this.$router.go(-1)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less">
  .el-message-box{
    width: auto !important;
  }
  .v-dropdown-container{
    width:100%;
    left:0px !important;
  }
  .el-switch{
    margin-left: 1rem;
  }
  .v-dropdown-caller{
    max-width: 77%;
  }
  .rg-caller-container,.rg-default-btn{
    max-width: 100% !important;
  }
  .rg-default-btn{
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  #addAddress{
    background-color: #fff;
    width: 100%;
    height: 100%;
    .bc{
      color: #fff;
      text-align: center;
      height: 50px;
      line-height: 50px;
      width: 90%;
      margin: 2rem auto;
      background-color: #55aaff;
      border-radius: 20px;
    }
    .add{
      width: 90%;
      margin: 0 auto;
      height: 70px;
      line-height:70px;
      background-color: #fff;
      border-bottom: 1px solid #ccc;
      p{
        line-height: 0px;
        position: relative;
        padding-left: 1rem;
        bottom: 0.5rem;
        color: red;
        font-size: 12px;
        opacity: 0;
      }
      input{
        border: 0px;
        height: 60px;
        margin-left: 1rem;
        font-size: 16px;
      }
      textarea{
        border: 0px;
        margin-left: 1rem;
        font-size: 14px;
      }
    }
  }
</style>
