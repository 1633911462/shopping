<template>
  <div id="userOrder">
    <adminHead to="/me">我的订单</adminHead>
    <order :msg="msg" type="user"></order>
  </div>
</template>

<script>
import adminHead from '@/components/administrators/adminHead.vue'
import order from '@/components/consumer/order.vue'
export default {
  components: { order, adminHead },
  data () {
    return {
      msg: JSON.parse(atob(localStorage.userName)).user
    }
  }
}
</script>

<style lang="less">
</style>
