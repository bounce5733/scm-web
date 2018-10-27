<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="员工账号" name="user">
          <user></user>
        </el-tab-pane>
        <el-tab-pane label="部门设置" name="dept">
          <dept></dept>
        </el-tab-pane>
        <el-tab-pane label="角色权限设置" name="role">
          <role></role>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import User from './user'
import Dept from './dept'
import Role from './role'

export default {
  components: {
    User,
    Dept,
    Role
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
