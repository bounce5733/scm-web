<template>

    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :default-openeds="asyncPermissionMenuKeys"
    >
      <sidebar-item :routes="allPermissionRouters"></sidebar-item>
    </el-menu>

</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'allPermissionRouters',
      'sidebar',
      'asyncPermissionMenuKeys'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
