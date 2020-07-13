<template>
  <div class="menu-wrapper">
    <router-link to="/" class="logo">
      <img src="../../../../assets/images/logo.png" />
    </router-link>

    <template v-for="item in routes">
      <div v-if="!item.hidden && item.children" :key="item.path">
        <router-link
          v-if="
            hasOneShowingChildren(item.children, item) &&
              !item.children[0].children &&
              !item.alwaysShow
          "
          :to="item.path + '/' + item.children[0].path"
          :key="item.children[0].name"
        >
          <el-menu-item
            :index="item.path + '/' + item.children[0].path"
            :class="{ 'submenu-title-noDropdown': !isNest }"
          >
            <i
              v-if="item.children[0].meta && item.children[0].meta.icon"
              :class="item.children[0].meta.icon"
            ></i>
            <span v-if="item.children[0].meta && item.children[0].meta.title">{{
              item.children[0].meta.title
            }}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item.name || item.path" :key="item.name">
          <template slot="title">
            <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
            <span v-if="item.meta && item.meta.title">{{
              item.meta.title
            }}</span>
          </template>
          <template v-for="child in item.children">
            <div v-if="!child.hidden" :key="child.name">
              <sidebar-item
                :is-nest="true"
                class="nest-menu"
                v-if="child.children && child.children.length > 0"
                :routes="[child]"
                :key="child.path"
              ></sidebar-item>
              <router-link
                v-else
                :to="item.path + '/' + child.path"
                :key="child.name"
              >
                <el-menu-item :index="item.path + '/' + child.path">
                  <i
                    v-if="child.meta && child.meta.icon"
                    :class="child.meta.icon"
                  ></i>
                  <span v-if="child.meta && child.meta.title">{{
                    child.meta.title
                  }}</span>
                </el-menu-item>
              </router-link>
            </div>
          </template>
        </el-submenu>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children, items) {
      console.log(children);
      let showingChildren = [];
      if (Array.isArray(children)) {
        showingChildren = children.filter(item => {
          return !item.hidden;
        });
      }

      //非首页的二级菜单增加顶级菜单显示
      if (items.children.length === 1 && items.children[0].name !== 'home') {
        return false; //二级菜单
      }

      if (showingChildren.length === 1) {
        return true; //true
      }
      return false;
    }
  }
};
</script>
<style lang="scss">
.logo {
  line-height: normal !important;
  height: auto !important;
  // border-bottom:1px solid #BFCBD9;
  background: #48586f;
}
</style>
