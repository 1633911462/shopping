<template>
  <div id="rootOrder">
    <adminHead to="/adminIndex">支付订单</adminHead>
    <order type="root" :msg="dpName"></order>
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
import order from '@/components/consumer/order.vue'
export default {
  components: { order, adminHead },
  data () {
    return {
      dpName: ''
    }
  },
  mounted () {
    if (JSON.parse(atob(localStorage.userName)).user !== 'admin') {
      this.$router.replace('/me')
      return false
    }
    this.getDp()
  }
}
</script>

<style lang="less">
</style>
