<template>
  <div class="app-container">
    <h3>角色权限管理</h3>
    <el-row>
      选择角色&nbsp;&nbsp; 
      <el-select v-model="selRoleid" @change="roleChange">
        <el-option v-for="item,index in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>&nbsp;&nbsp; 
      <el-button icon="el-icon-edit" style="border:none;" @click="openModifyRoleName">修改角色名称</el-button>
      <div style="font-size:0.9em;font-weight:bold;">
        <dl style="line-height: 25px; color: rgb(147, 166, 183);">
        <dt>说明：</dt>
        <dd>1、具备该角色的用户登录后显示操作员工作台；</dd>
        <dd>2、修改角色权限后，所有赋予此角色的员工账号对应权限均将修改；</dd>
        <dd>3、系统管理员角色不允许改名，也不允许修改其操作权限；</dd>
        <dd style="color: rgb(249, 104, 104);">4、“禁止查看商品订货价”不得与【商品管理、商品删除、商品导出、促销管理权限】同时勾选；</dd>
        <dd style="color: rgb(249, 104, 104);">5、“禁止查看订单金额”不得与【订单修改、订/退单审核、财务审核、代下订/退单、订单商品统计查看、订单商品统计导出、发货统计查看、发货统计导出、资金所有权限、报表所有权限】同时勾选。</dd>
        <dd style="color: rgb(249, 104, 104);">6、需要实现仅让业务员看到自己客户商品报价并且能代下单的场景，请勾选“禁止查看商品订货价”、“报价单查看”、“代下订单”权限。</dd></dl>
      </div>
    </el-row>
    <h3>角色权限明细</h3>
    <el-row v-for="val,key in appActions" :key="key">
      <el-col :span="4">
        <div style="border: 1px solid #e7e9f1;text-align:center;background-color:#eef1f9;font-size:14;font-weight:400;" :style="{lineHeight:modelHeight[key],height:modelHeight[key]}">
          <span>{{ key | modelKeyToName }}</span>
        </div>
      </el-col>
      <el-col :span="20">
        <div style="border: 1px solid #e7e9f1;">
          <el-checkbox-group v-for="item,index in val" :key="index" v-model="checkList[key]">
            <el-row>
              <el-col v-for="subitem,subindex in item" :key="subindex" :span="4">
                <div style="padding-left:20px;line-height:20px;"><el-checkbox :label="subitem.key">{{subitem.name}}</el-checkbox></div>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <br>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="saveRole">保存</el-button>
    </el-row>
    <!-- 修改角色名称 -->
    <el-dialog title="修改角色名称" :visible.sync="nameRoleFormVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="nameRole" :rules="nameRoleRules" label-width="80px" ref="nameRoleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="nameRole.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelModifyRoleForm">取消</el-button>
        <el-button type="primary" @click.native="saveRoleName">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadRole, roleMenus, editRole, assignMenus } from '@/api/bas/role'
import { SUCCESS_TIP_TITLE, SAVE_SUCCESS, EDIT_SUCCESS } from '@/utils/constant'

export default {
  data() {
    return {
      roles: [],
      selRoleid: undefined,
      checkList: { order: [], cus: [], code: [], console: [], bas: [], sys: [] },
      modelKeyName: {}, // 顶级模块名值对
      modelHeight: {}, // 权限选择模块背景高度
      // ------修改名称------
      nameRole: {},
      nameRoleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { max: 64, message: '最大长度64个字符', trigger: 'blur' }
        ]
      },
      nameRoleFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sysMenuActions'
    ]),
    appActions() {
      // 按名称中分割线划分大类
      const actionMap = {}
      for (const key in this.sysMenuActions) {
        if (key.indexOf('_') > 0) {
          const newkey = key.substr(0, key.indexOf('_'))
          if (actionMap[newkey]) {
            actionMap[newkey] = actionMap[newkey].concat(this.sysMenuActions[key])
          } else {
            actionMap[newkey] = this.sysMenuActions[key]
          }
        }
      }
      // 按5个一行分类
      const result = {}
      for (const key in actionMap) {
        result[key] = []
        const line = parseInt(actionMap[key].length / 5) + 1
        this.modelHeight[key] = line * 25.3 + 'px'
        for (let i = 0; i <= line; i++) {
          result[key][i] = actionMap[key].slice(i * 5, i * 5 + 5)
        }
      }
      return result
    }
  },
  filters: {
    modelKeyToName: function(value) {
      switch (value) {
        case 'order':
          return '订单'
        case 'cus':
          return '客户'
        case 'code':
          return '字典'
        case 'console':
          return '控制台'
        case 'bas':
          return '基础'
        case 'sys':
          return '系统'
        default:
          return ''
      }
    }
  },
  methods: {
    load: function() {
      loadRole().then(res => {
        this.roles = res.data
        if (!this.selRoleid) {
          this.selRoleid = this.roles[0].id
        }
        roleMenus(this.roles[0].id).then(res => {
          res.data.forEach(item => {
            const key = item.menuKey.substr(0, item.menuKey.indexOf('_'))
            if (this.checkList[key]) {
              this.checkList[key].push(item.actionKey)
            }
          })
        })
      })
    },
    saveRole: function() {
      const actionMap = {}
      for (const key in this.sysMenuActions) {
        this.sysMenuActions[key].forEach(item => {
          for (const subkey in this.checkList) {
            this.checkList[subkey].forEach(subitem => {
              if (item.key === subitem) {
                if (!actionMap[key]) {
                  actionMap[key] = [item.key]
                } else {
                  actionMap[key].push(item.key)
                }
              }
            })
          }
        })
      }
      // 补全父菜单
      for (const key in actionMap) {
        const paths = key.split('_')
        if (paths.length > 1) {
          let path = paths[0]
          if (!actionMap[path]) {
            actionMap[path] = []
          }
          for (let i = 1; i < paths.length - 1; i++) {
            path += ('_' + paths[i])
            if (!actionMap[path]) {
              actionMap[path] = []
            }
          }
        }
      }
      assignMenus(this.selRoleid, actionMap).then(res => {
        this.$notify({
          title: SUCCESS_TIP_TITLE,
          message: SAVE_SUCCESS,
          type: 'success'
        })
      })
    },
    roleChange: function(roleid) {
      this.selRoleid = roleid
      this.checkList = { order: [], code: [], console: [], bas: [], sys: [] }
      roleMenus(roleid).then(res => {
        res.data.forEach(item => {
          const key = item.menuKey.substr(0, item.menuKey.indexOf('_'))
          if (this.checkList[key]) {
            this.checkList[key].push(item.actionKey)
          }
        })
      })
    },
    // ------修改名称------
    openModifyRoleName: function() {
      this.roles.forEach(role => {
        if (role.id === this.selRoleid) {
          this.nameRole = { id: this.selRoleid, name: role.name }
        }
      })
      this.nameRoleFormVisible = true
    },
    saveRoleName: function() {
      this.$refs.nameRoleForm.validate(valid => {
        if (valid) {
          editRole(this.nameRole).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: EDIT_SUCCESS,
              type: 'success'
            })
            this.roles.forEach(role => {
              if (role.id === this.nameRole.id) {
                role.name = this.nameRole.id
              }
            })
            this.selRoleid = this.nameRole.id
            this.load()
            this.cancelModifyRoleForm()
          })
        }
      })
    },
    cancelModifyRoleForm: function() {
      this.nameRoleFormVisible = false
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  h3 {
    display: block;
    font-size: 1.17em;
    font-weight: normal;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    color: #415161;
  }
</style>