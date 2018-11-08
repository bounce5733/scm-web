<template>
  <div>
    <el-row>
      <el-form @submit.native.prevent :inline="true">
        <el-col :span="22">
          <el-form-item>
            <el-cascader @change="deptChange" style="width: 120px;"
              expand-trigger="hover"
              :options="allDepts"
              change-on-select
              :props="selProps"
              v-model="deptidsParam"
              :show-all-levels="false">
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-input v-model="params.param" @keyup.native.enter="queryByPage" placeholder="请输入员工姓名/账号/手机/职位" style="width: 530px;">
              <el-select slot="prepend" @change="statusChange" style="width: 120px;" v-model="params.status">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button slot="append" @click="queryByPage" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" @click="openAdd" size="small">新增账号</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-table :data="users" border style="width: 100%;" @sort-change="sortData" @cell-mouse-enter="assignUser" :row-class-name="tableRowClassName">
      <el-table-column prop="account" label="账号" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" sortable></el-table-column>
      <el-table-column prop="position" label="职位" sortable></el-table-column>
      <el-table-column prop="deptid" :formatter="formatDeptCol" label="部门" sortable></el-table-column>
      <el-table-column prop="mobile" label="手机" sortable></el-table-column>
      <el-table-column prop="email" label="邮箱" sortable></el-table-column>
      <el-table-column fixed="right" align="center" width="60">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" @command="handleAction">
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit" v-if="scope.row.enabled === 'T'"><i class="el-icon-edit"></i>&nbsp;修改</el-dropdown-item>
              <el-dropdown-item command="enable" v-if="scope.row.enabled === 'T'" :disabled="scope.row.isCompanyCreater === 'T'" divided><i class="el-icon-circle-close"></i>&nbsp;禁用</el-dropdown-item>
              <el-dropdown-item command="enable" v-else divided><i class="el-icon-circle-check"></i>&nbsp;启用</el-dropdown-item>
              <el-dropdown-item command="remove" v-if="scope.row.enabled === 'F'" divided><i class="el-icon-delete"></i>&nbsp;删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :current-page="params.pageNum" :page-size="params.pageSize" :total="total" style="float:right;">
    </el-pagination>

    <!--编辑用户-->
    <el-dialog :title="formTitle" width="70%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="user" ref="form" :rules="userRules" label-width="80px">
        <p class="legend-title">基础信息</p>
        <el-row>
          <el-col :span="16">
            <el-row>
              <el-col :span="20">
                <el-form-item label="登录账号" prop="account">
                  <el-input :disabled="formTitle === '编辑'" v-model="user.account"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                &nbsp;&nbsp;&nbsp;&nbsp;<el-button v-if="formTitle === '编辑'" type="text" @click="openResetPwd">重置密码</el-button>
              </el-col>
            </el-row>
            <el-form-item v-if="formTitle === '新增'" label="密码" prop="pwd">
              <el-input type="password" v-model="user.pwd"></el-input>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.weak}">弱</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.middle}">中</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.strong}">强</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
            </el-form-item>
            <el-form-item v-if="formTitle === '新增'" label="确认密码" prop="confirmPwd">
              <el-input :disabled="!pwdValid" type="password" v-model="user.confirmPwd"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="user.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机" prop="mobile">
                  <el-input :disabled="formTitle === '编辑'" v-model="user.mobile"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="部门" prop="deptids">
              <el-cascader style="width:100%"
                expand-trigger="hover"
                :options="depts"
                change-on-select
                clearable
                :props="selProps"
                v-model="user.deptids">
              </el-cascader>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="user.position"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="user.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="user.qq"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <p class="legend-title">
          权限设置
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              注意，如果您勾选的角色中同时包含“禁止查看商品价格与订单金
              <br>额”和【订单修改、订/退单审核、财务审核、代下订/退单、订单商品
              <br>统计查看、商品管理、促销管理以及资金所有权限、报表所有权
              <br>限】，将造成权限冲突。
            </div>
            <span style="color: rgb(147, 166, 183);font-size: 0.9em;">
              &nbsp;&nbsp;&nbsp;&nbsp;权限与角色关联，选择该账号的角色可完成权限设置
              <i class="el-icon-question"></i>
            </span>
          </el-tooltip>
        </p>
        <el-form-item label="账号权限">
          <el-checkbox-group v-model="user.roleids">
            <el-row v-for="items,index in roles" :key="index">
              <el-checkbox v-for="role in items" :key="role.id" :label="role.id" @change="roleChecked">{{role.name}}</el-checkbox>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="权限明细">
        </el-form-item>
        <el-row v-for="val,key in appActions" :key="key">
            <el-col :span="4">
              <div style="border-left: 1px solid #e7e9f1;border-bottom: 1px solid #e7e9f1;text-align:left;background-color:#eef1f9;font-size:14;font-weight:400;" :style="{lineHeight:modelHeight[key],height:modelHeight[key]}">
                <span>{{ key | modelKeyToName }}</span>
              </div>
            </el-col>
            <el-col :span="20">
              <div style="border-left: 1px solid #e7e9f1;border-bottom: 1px solid #e7e9f1;">
                <el-checkbox-group v-for="item,index in val" :key="index" v-model="roleCheckList[key]">
                  <el-row>
                    <el-col v-for="subitem,subindex in item" :key="subindex" :span="4">
                      <div style="padding-left:20px"><el-checkbox disabled :label="subitem.key">{{subitem.name}}</el-checkbox></div>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </div>
            </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelForm">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </el-dialog>

    <!--重置密码-->
    <el-dialog title="重置密码" width="40%" :close-on-click-modal="false" :visible.sync="resetPwdFormVisible">
      <el-form :model="resetPwd" ref="resetPwdForm" :rules="resetPwdRules" label-width="80px">
        <el-form-item label="账号" prop="account">
          <el-input disabled v-model="resetPwd.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="resetPwd.pwd"></el-input>
          <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.weak}">弱</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
          <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.middle}">中</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
          <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.strong}">强</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input :disabled="!pwdValid" type="password" v-model="resetPwd.confirmPwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelResetPwdForm">取消</el-button>
        <el-button type="primary" @click.native="savePwd">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryUserByPage, addUser, editUser, enableUser, removeUser, resetPwd } from '@/api/bas/user'
import { loadRole, roleMenus, userRoles, userMenus } from '@/api/bas/role'
import { validateMobile, validatePassword, validateEmail, validateQQ } from '@/utils/validate'
import { SUCCESS_TIP_TITLE, SAVE_SUCCESS, EDIT_SUCCESS, REMOVE_SUCCESS, WARNING_TIP_TITLE, NUM_ID_ALL } from '@/utils/constant'
import md5 from 'js-md5'

export default {

  data() {
    const checkPassword = (rule, value, callback) => {
      const flag = validatePassword(value)
      if (flag < 4) {
        this.pwdColor = {
          weak: '#fff',
          middle: '#fff',
          strong: '#fff'
        }
        this.pwdValid = false
      } else {
        this.pwdValid = true
      }
      switch (flag) {
        case 0:
          return callback(new Error('密码不能为空或空字符串'))
        case 1:
          return callback(new Error('密码长度必须6-20位'))
        case 2:
          return callback(new Error('密码只能包含大小写英文字符与数字'))
        case 3:
          return callback(new Error('密码至少数字或大小写字母两种类型'))
        case 4:
          this.pwdColor = {
            weak: 'green',
            middle: '#fff',
            strong: '#fff'
          }
          break
        case 5:
          this.pwdColor = {
            weak: 'green',
            middle: 'green',
            strong: '#fff'
          }
          break
        case 6:
          this.pwdColor = {
            weak: 'green',
            middle: 'green',
            strong: 'green'
          }
          break
      }
      callback()
    }
    const checkConfirmPassword = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        return callback(new Error('确认密码不能为空'))
      } else if (value.trim() !== this.user.pwd.trim()) {
        this.user.confirmPwd = ''
        return callback(new Error('确认密码错误，请重新输入'))
      }
      callback()
    }
    const checkResetPwdConfirmPassword = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        return callback(new Error('确认密码不能为空'))
      } else if (value.trim() !== this.resetPwd.pwd.trim()) {
        this.resetPwd.confirmPwd = ''
        return callback(new Error('确认密码错误，请重新输入'))
      }
      callback()
    }
    const checkMobile = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validateMobile(value)) {
          return callback(new Error('手机号码格式不正确'))
        }
        callback()
      } else {
        return callback(new Error('手机号码不能为空'))
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (value.length > 45) {
          return callback(new Error('邮箱不能超过45个字符'))
        }
        if (!validateEmail(value)) {
          return callback(new Error('邮箱格式不正确'))
        }
      }
      callback()
    }
    const checkQQ = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validateQQ(value)) {
          return callback(new Error('QQ号码格式不正确'))
        }
      }
      callback()
    }

    return {
      selProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      total: 0,
      params: {
        param: '',
        status: '',
        deptid: NUM_ID_ALL,
        order: 'desc',
        orderField: 'createdTime',
        pageNum: 1,
        pageSize: 10
      },
      allDepts: [], // 查询用部门集合
      deptidsParam: [NUM_ID_ALL], // 查询用部门选择数组
      users: [],
      statusOptions: [{
        value: '',
        label: '全部状态'
      }, {
        value: 'T',
        label: '启用'
      }, {
        value: 'F',
        label: '禁用'
      }],
      // ------编辑------
      deptids: [],
      user: {},
      userRules: {
        account: [
          { required: true, message: '登录账号不能为空', trigger: 'blur' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        confirmPwd: [
          { required: true, validator: checkConfirmPassword, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: checkMobile }
        ],
        deptids: [
          { required: true, message: '部门不能为空', trigger: 'blur' }
        ],
        position: [
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        email: [
          { trigger: 'blur', validator: checkEmail }
        ],
        qq: [
          { trigger: 'blur', validator: checkQQ }
        ]
      },
      formTitle: '',
      formVisible: false,
      depts: this.$store.state.code.appCascadeCode.dept === undefined ? [] : this.$store.state.code.appCascadeCode.dept,
      pwdColor: {
        weak: '#fff',
        middle: '#fff',
        strong: '#fff'
      },
      pwdValid: false,
      roles: [],
      roleCheckList: { code: [], console: [], bas: [], sys: [] },
      modelKeyName: {}, // 顶级模块名值对
      modelHeight: {}, // 权限选择模块背景高度
      // ------重置密码------
      resetPwd: {},
      resetPwdFormVisible: false,
      resetPwdRules: {
        pwd: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        confirmPwd: [
          { required: true, validator: checkResetPwdConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sysMenuActions',
      'appCascadePathCode',
      'appCascadeCode'
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
        this.modelHeight[key] = actionMap[key].length * 5 + 'px'
        for (let i = 0; i <= actionMap[key].length / 5; i++) {
          result[key][i] = actionMap[key].slice(i * 5, i * 5 + 5)
        }
      }
      return result
    }
  },
  filters: {
    modelKeyToName: function(value) {
      switch (value) {
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
    queryByPage: function() {
      this.params.deptid = this.deptidsParam[this.deptidsParam.length - 1]
      queryUserByPage(this.params).then(res => {
        this.users = res.data.list
        this.total = res.data.total
      })
    },
    pageChange: function(val) {
      this.params.pageNum = val
      this.queryByPage()
    },
    handleAction: function(action) {
      switch (action) {
        case 'edit':
          this.openEdit()
          break
        case 'enable':
          this.enable()
          break
        case 'remove':
          this.remove()
      }
    },
    formatDeptCol: function(row, column, cellValue, index) {
      if (cellValue !== 0) {
        return this.appCascadePathCode.dept[cellValue].name
      } else {
        return ''
      }
    },
    tableRowClassName: function({ row, rowIndex }) {
      if (row.enabled === 'F') {
        return 'disabled-row'
      }
      return ''
    },
    assignUser: function(row, column, cell, event) {
      if (column.label === undefined) {
        this.user = row
      }
    },
    sortData: function({ column, prop, order }) {
      this.params.order = order === null ? '' : order === 'ascending' ? 'asc' : 'desc'
      this.params.orderField = prop
      this.queryByPage()
    },
    deptChange: function() {
      this.params.pageNum = 1
      this.queryByPage()
    },
    statusChange: function() {
      this.params.pageNum = 1
      this.queryByPage()
    },
    // ------编辑------
    openAdd: function() {
      this.roleCheckList = { code: [], console: [], bas: [], sys: [] }
      loadRole().then(res => {
        let rowcount = -1
        res.data.forEach((role, index) => {
          if (index % 4 === 0) {
            rowcount++
            this.roles[rowcount] = []
            this.roles[rowcount].push(role)
          } else {
            this.roles[rowcount].push(role)
          }
        })
        this.deptids = this.appCascadeCode.dept
        this.user = { roleids: [] }
        this.pwdColor = {
          weak: '#fff',
          middle: '#fff',
          strong: '#fff'
        }
        this.pwdValid = false
        this.formTitle = '新增'
        this.formVisible = true
      })
    },
    openEdit: function() {
      this.roleCheckList = { code: [], console: [], bas: [], sys: [] }
      loadRole().then(res => {
        let rowcount = -1
        res.data.forEach((role, index) => {
          if (index % 4 === 0) {
            rowcount++
            this.roles[rowcount] = []
            this.roles[rowcount].push(role)
          } else {
            this.roles[rowcount].push(role)
          }
        })
        userRoles(this.user.id).then(subres => {
          this.user.roleids = subres.data
          userMenus(this.user.id).then(ssubres => {
            this.deptids = this.appCascadeCode.dept
            const menuActionMap = ssubres.data
            for (const key in menuActionMap) {
              const moduleCode = key.substr(0, (key.indexOf('_')))
              if (this.roleCheckList[moduleCode]) {
                menuActionMap[key].forEach(userAction => {
                  let hasExist = false
                  this.roleCheckList[moduleCode].forEach(action => {
                    if (userAction === action) {
                      hasExist = true
                    }
                  })
                  if (!hasExist) {
                    this.roleCheckList[moduleCode].push(userAction)
                  }
                })
              }
            }
          })
          if (this.appCascadePathCode.dept[this.user.deptid]) {
            this.user.deptids = Object.assign([], this.appCascadePathCode.dept[this.user.deptid].path)
          }
          this.formTitle = '编辑'
          this.formVisible = true
        })
      })
    },
    enable: function() {
      const tip = this.user.enabled === 'T' ? '禁用' : '启用'
      this.$confirm('确定' + tip + '用户 [' + this.user.name + ']', '提示', { type: 'warning' }).then(() => {
        enableUser(this.user).then(res => {
          this.queryByPage()
        })
      }).catch(() => {})
    },
    remove: function() {
      this.$confirm('确定删除用户 [' + this.user.name + ']', '提示', { type: 'warning' }).then(() => {
        removeUser(this.user.id).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: REMOVE_SUCCESS,
            type: 'success'
          })
          this.queryByPage()
        })
      }).catch(() => {})
    },
    save: function() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.user.roleids.length === 0) {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '至少需要一个权限',
              type: 'warning'
            })
            return
          }
          if (this.formTitle === '新增') {
            const tmpPwd = this.user.pwd
            const tmpConfirmPwd = this.user.confirmPwd
            this.user.pwd = md5(this.user.pwd)
            delete this.user.confirmPwd
            addUser(this.user).then(res => {
              if (res.status === 302) {
                this.$notify({
                  title: WARNING_TIP_TITLE,
                  message: '账号已经存在，请更换账号',
                  type: 'warning'
                })
                this.user.pwd = tmpPwd
                this.user.confirmPwd = tmpConfirmPwd
                this.user.account = ''
              } else {
                this.$notify({
                  title: SUCCESS_TIP_TITLE,
                  message: SAVE_SUCCESS,
                  type: 'success'
                })
                this.queryByPage()
                this.cancelForm()
              }
            })
          } else {
            this.user.deptid = this.user.deptids[this.user.deptids.length - 1]
            editUser(this.user).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: EDIT_SUCCESS,
                type: 'success'
              })
              this.queryByPage()
              this.cancelForm()
            })
          }
        }
      })
    },
    roleChecked: function() {
      this.user.roleids.forEach(roleid => {
        this.roleCheckList = { code: [], console: [], bas: [], sys: [] }
        roleMenus(roleid).then(res => {
          res.data.forEach(item => {
            const key = item.menuKey.substr(0, item.menuKey.indexOf('_'))
            if (this.roleCheckList[key]) {
              this.roleCheckList[key].push(item.actionKey)
            }
          })
        })
      })
    },
    cancelForm: function() {
      this.$refs.form.resetFields()
      this.formVisible = false
    },
    // ------重置密码------
    openResetPwd: function() {
      this.resetPwd = { id: this.user.id, account: this.user.account }
      this.pwdColor = {
        weak: '#fff',
        middle: '#fff',
        strong: '#fff'
      }
      this.pwdValid = false
      this.resetPwdFormVisible = true
    },
    savePwd: function() {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          delete this.resetPwd.confirmPwd
          this.resetPwd.pwd = md5(this.resetPwd.pwd)
          resetPwd(this.resetPwd).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: SAVE_SUCCESS,
              type: 'success'
            })
            this.cancelResetPwdForm()
          })
        }
      })
    },
    cancelResetPwdForm: function() {
      this.$refs.resetPwdForm.resetFields()
      this.resetPwdFormVisible = false
    }
  },
  mounted() {
    const allDept = {
      name: '全部部门',
      id: NUM_ID_ALL,
      children: null
    }
    this.allDepts.push(allDept)
    if (this.$store.state.code.appCascadeCode.dept !== undefined) {
      this.allDepts = this.allDepts.concat(this.$store.state.code.appCascadeCode.dept)
    }
    this.queryByPage()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .legend-title {
    color: #03b8cc;
    font-weight: 500;
    margin-bottom: 30px;
  }
</style>

