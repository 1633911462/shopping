<template>
  <div id="msg">
    <div class="head">
      <h3>消息</h3>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped="scoped">
  .head{
   position: sticky;
   top:0px;
   z-index:1;
   width: 100%;
   height: 40px;
   text-align: center;
   line-height: 40px;
   background: #f1f1f0;
   border-bottom: 1px solid #fff;
   h3{
     text-align: center;
   }
  }
</style>
