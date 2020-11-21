<template>
  <div id="shopOrder">
    <adminHead to="/business">店铺订单</adminHead>
    <order type="dpName" :msg="dpName"></order>
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
    this.getDp()
  }
}
</script>

<style lang="less">
</style>
