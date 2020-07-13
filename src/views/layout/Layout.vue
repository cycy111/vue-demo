<template>
  <div class="app-wrapper" :class="{ hideSidebar: !sidebar.opened }">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container" :style="{ width: mainContainerWidth + 'px' }">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components';

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data() {
    return {
      mainContainerWidth: 780
    };
  },
  computed: {
    sidebar() {
      //  	console.log(this.$store.state.app.sidebar)
      return this.$store.state.app.sidebar;
    }
  },
  mounted() {
    //console.log('Layout created')
    console.log(document.body.clientWidth);
    const that = this;
    window.onresize = c => {
      return (c => {
        that.mainContainerWidth = document.body.clientWidth - 220;
      })();
    };
  },
  created() {
    this.mainContainerWidth = document.body.clientWidth - 220;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
