<template>
  <div id="adminHead">
    <div class="header">
        <div>
          <router-link :to="to" replace>
           <ion-icon name="chevron-back-outline"></ion-icon>
          </router-link>
        </div>
      <slot>组件</slot>
    </div>
    <div class="block"></div>
  </div>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: '/adminIndex'
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  #adminHead{
    .block{
      height: 50px;
    }
    .header{
      position: fixed;
      top:0;
      z-index:9999;
        div{
          a{
            float:left;
            ion-icon{
              font-size: 25px;
              color: #fff;
              position: relative;
              top:5px;
              left:5px;
            }
          }
        }
      @height: 50px;
      width: 100%;
      height: @height;
      line-height: @height;
      color: #fff;
      font-size: 18px;
      background-color: #4E5FE3;
      text-align: center;
    }
  }
</style>
