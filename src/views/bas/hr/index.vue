<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="员工账号" name="user">
        <user></user>
      </el-tab-pane>
      <el-tab-pane label="部门设置" name="dept"></el-tab-pane>
      <el-tab-pane label="角色权限设置" name="role"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import User from './user'

export default {
  components: {
    User
  },
  data() {
    return {
      activeName: 'user'
    }
  },
  methods: {
    tabChange: function(tab, event) {
    }
  }
}
</script>
