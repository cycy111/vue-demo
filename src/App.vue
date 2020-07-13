<template>
  <div id="app">
    <router-view></router-view>
    <!-- <remote-js src="//webapi.amap.com/maps?v=1.4.6&key=6505ec512e5a72adec6a61b2b1b46535"></remote-js> -->
    <!-- <remote-js src="//webapi.amap.com/demos/js/liteToolbar.js"></remote-js> -->
    <!-- <remote-js src="//cache.amap.com/lbs/static/addToolbar.js"></remote-js> -->
    <!-- <remote-js src="//webapi.amap.com/ui/1.0/main.js?v=1.0.11"></remote-js> -->
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>

<style lang="scss">
@import './styles/custom.scss';

.iconfont {
  font-size: 14px;
}
</style>
