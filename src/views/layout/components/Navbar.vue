<template>
  <el-menu class="navbar" mode="horizontal">
  
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>
    
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item" trigger="hover">
        <div class="avatar-wrapper">
          <span>{{username}}</span>
          <svg-icon icon-class="admin"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <svg-icon icon-class="icon-account"></svg-icon>&nbsp;&nbsp;账号信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <svg-icon icon-class="icon-account"></svg-icon><span @click="logout">&nbsp;&nbsp;退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item" trigger="hover">
        <div class="avatar-wrapper">
          <svg-icon icon-class="services"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <svg-icon icon-class="icon-account"></svg-icon>&nbsp;&nbsp;账号信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <svg-icon icon-class="icon-account"></svg-icon><span @click="logout">&nbsp;&nbsp;退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item" trigger="hover">
        <div class="avatar-wrapper">
          <svg-icon icon-class="bell"></svg-icon>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <svg-icon icon-class="icon-account"></svg-icon>&nbsp;&nbsp;账号信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <svg-icon icon-class="icon-account"></svg-icon><span @click="logout">&nbsp;&nbsp;退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  components: {
    Hamburger,
    Breadcrumb
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'username'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('logOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
