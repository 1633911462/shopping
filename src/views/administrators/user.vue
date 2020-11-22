<template>
  <div id="user">
    <adminHead>用户列表</adminHead>
    <el-table v-if="list.length > 0"
        :data="list"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="姓名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺名">
                <span>{{ props.row.dpName }}</span>
              </el-form-item>
              <el-form-item label="用户ID">
                <span>{{ props.row._id }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ props.row.user}}</span>
              </el-form-item>
              <el-form-item label="用户密码">
                <span>{{ props.row.password }}</span>
              </el-form-item>
              <el-form-item label="电子邮箱">
                <span>{{ props.row.mail || '未绑定' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="name">
        </el-table-column>
        <el-table-column
          label="店铺名"
          :filters="[{ text: '商家', value: '商家' }, { text: '未开通', value: '未开通' }]"
          :filter-method="filterTag"
          prop="dpName">
        </el-table-column>
        <el-table-column
          sortable
          label="注册日期"
          prop="date">
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
export default {
  components: { adminHead },
  data () {
    return {
      list: []
    }
  },
  created () {
    if (JSON.parse(atob(localStorage.userName)).user !== 'admin') {
      this.$router.replace('/me')
      return false
    }
    this.getList()
  },
  methods: {
    filterTag (value, row) {
      if (value === '商家') {
        return row.dpName !== '未开通'
      }
      return row.dpName === value
    },
    getList () {
      this.axios.get(`${this.ip}/userList`)
        .then(i => {
          this.list = i.data
          this.list.forEach(i => {
            if (i.type === 'xf') {
              i.dpName = '未开通'
            }
          })
        })
    }
  }
}
</script>

<style lang="less">
  .el-form-item{
    display: block !important;
  }
</style>
