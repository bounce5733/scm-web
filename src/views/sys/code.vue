<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-row>
          <el-col :span="2" :offset="21">
            <el-form @submit.native.prevent :inline="true">
              <el-form-item>
                <el-button type="primary" :disabled="!actions.includes('addCode')" size="small" @click="openCodeAdd">新增</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table :data="codes" @row-click="showItem" highlight-current-row stripe border style="width: 100%;">
          <el-table-column prop="code" label="编码"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column label="操作" width="78">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="danger" size="small" :disabled="!actions.includes('removeCode')" @click="removeCode(scope.row.code)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-col :span="2" :offset="21">
            <el-form @submit.native.prevent :inline="true">
              <el-form-item>
                <el-button type="primary" :disabled="code.code === undefined || !actions.includes('addCodeItem')" @click="openAddItem" size="small">新增</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table :data="code.items" highlight-current-row border style="width: 100%;">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <span v-html="scope.row.indent"></span>
              <svg-icon :icon-class="scope.row.folderType" class-name="svn-icon-product-catalog"></svg-icon>
              &nbsp;&nbsp;
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="340">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" @click="openAddSubItem(scope.row)" icon="el-icon-plus" size="small">新增子类</el-button>
                <el-button type="primary" :disabled="!actions.includes('editCodeItem')" @click="openEditItem(scope.$index, scope.row)" size="small">修改</el-button>
                <el-button type="primary" icon="el-icon-upload2" @click="moveTop(scope.row)" size="small">置顶</el-button>
                <el-button type="danger" :disabled="!actions.includes('removeCodeItem')" @click="removeItem(scope.$index, scope.row)" size="small">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 编辑字典界面 -->
    <el-dialog title="编辑" width="30%" :visible.sync="codeFormVisible" >
      <el-form :model="code" ref="codeForm" :rules="codeRules">
        <el-form-item label="编码:" label-width="80px" prop="code">
            <el-input v-model="code.code" auto-complete="off" style="width:80%" placeholder="编码由字母与下划线组成"></el-input>
        </el-form-item>
        <el-form-item label="名称:" label-width="80px" prop="name">
            <el-input v-model="code.name" auto-complete="off" style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCodeForm">取 消</el-button>
        <el-button type="primary" @click="saveCode">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑字典项目界面 -->
  <el-dialog :title="itemFormTitle" :visible.sync="itemFormVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="item" :rules="itemRules" ref="itemForm" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类">
          <el-cascader style="width:100%"
            placeholder="根目录"
            expand-trigger="hover"
            :options="pcodes"
            clearable
            :props="codeSelProps"
            v-model="item.path"
            change-on-select
            :disabled="itemFormTitle === '新增' || itemFormTitle === '新增子类'">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancelItemForm">取消</el-button>
          <el-button type="primary" @click="saveItem">确定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadCode, loadSysCode, loadSysPathCode, addCode, removeCode, addItem, editItem, removeItem, moveTopCodeItem } from '@/api/sys/code'
import { SAVE_SUCCESS, EDIT_SUCCESS, REMOVE_SUCCESS, SUCCESS_TIP_TITLE, WARNING_TIP_TITLE } from '@/utils/constant'

export default {

  data() {
    const validateCode = (rule, value, callback) => {
      if (this.code.code === undefined || this.code.code.trim().length === 0) {
        return callback(new Error('请输入编码'))
      }
      // 校验编码格式
      const reg = /^[A-Za-z]+$/
      const codeVal = this.code.code.trim()
      const isChar = reg.test(codeVal.replace(/_/g, ''))
      if (!isChar) {
        return callback(new Error('编码由字母与下划线组成'))
      }
      // 校验唯一性
      let isUnique = true
      this.codes.forEach(item => {
        if (item.code.toLowerCase() === codeVal.toLowerCase()) {
          isUnique = false
        }
      })
      if (!isUnique) {
        return callback(new Error('编码不唯一'))
      }
      callback()
    }

    return {
      actions: this.$store.state.permission.menus[this.$route.name],
      codes: [], // 系统字典列表
      code: {}, // 当前选中字典
      // ------新增类型------
      codeFormVisible: false,
      codeRules: {
        code: [
          { required: true, trigger: 'blur', validator: validateCode }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      // ------编辑项目------
      codeSelProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      itemFormVisible: false,
      itemFormTitle: '',
      item: {},
      pcodes: [],
      itemRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      tmpPath: [] // 用于校验所选上级分类是否为原上级分类子类型
    }
  },
  computed: {
    ...mapGetters([
      'sysCode',
      'sysPathCode'
    ])
  },
  methods: {
    loadCode: function() {
      loadCode().then(res => {
        this.codes = res.data
        this.codes.forEach(code => {
          if (this.code.code === undefined) { // 首次进入默认选择第一个
            this.code = code
          } else { // 已经选中过则重新赋最新值
            if (this.code.code === code.code) {
              this.code = code
            }
          }
          code.items.forEach(item => {
            item.depth = this.sysPathCode[item.id].path.length
            let isLeaf = true
            code.items.forEach(subitem => {
              if (subitem.pid === item.id) {
                isLeaf = false
              }
            })
            item.folderType = isLeaf ? 'folder' : 'folder-open'
            if (item.depth > 1) {
              let indent = ''
              for (let i = 1; i < item.depth; i++) {
                indent += '&nbsp;&nbsp;&nbsp;&nbsp;'
              }
              item.indent = indent
            } else {
              item.indent = ''
            }
          })
        })
      })
    },
    showItem: function(row, event, column) {
      this.code = row
      this.code.items.forEach(item => {
        let indent = ''
        const depth = this.sysPathCode[item.id].path.length - 1
        for (let i = 0; i < depth; i++) {
          indent += '- - '
        }
        if (depth > 0) {
          item.showName = indent + '|- ' + item.name
        } else {
          item.showName = item.name
        }
      })
    },
    // ------新增类型------
    openCodeAdd: function() {
      this.code = {}
      this.codeFormVisible = true
    },
    saveCode: function() {
      this.$refs.codeForm.validate((valid) => {
        if (valid) {
          addCode(this.code).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: SAVE_SUCCESS,
              type: 'success'
            })
            this.refreshCache()
            this.cancelCodeForm()
          })
        }
      })
    },
    removeCode: function(selcode) {
      this.codes.forEach(code => {
        if (code.code === selcode) {
          if (code.items.length > 0) {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '请先删除码表项目',
              type: 'warning'
            })
            return
          } else {
            this.$confirm('确实要删除该字典', '提示', { type: 'warning' }).then(() => {
              removeCode(selcode).then(res => {
                this.$notify({
                  title: SUCCESS_TIP_TITLE,
                  message: REMOVE_SUCCESS,
                  type: 'success'
                })
                this.code = {}
                this.refreshCache()
              })
            }).catch(() => {})
          }
        }
      })
    },
    cancelCodeForm: function() {
      this.code = {}
      this.$refs.codeForm.resetFields()
      this.codeFormVisible = false
    },
    // ------编辑字典项目------
    openAddItem: function() {
      this.itemFormTitle = '新增'
      this.itemFormVisible = true
      this.item = { depth: 1, pid: 0 }
    },
    openEditItem: function(index, row) {
      this.item = Object.assign({}, row)
      this.itemFormTitle = '编辑'
      this.tmpPath = this.sysPathCode[row.id].path
      const path = Object.assign([], this.tmpPath)
      path.splice(-1, 1)
      this.item.path = path
      this.pcodes = this.sysCode[this.code.code] === undefined ? [] : this.sysCode[this.code.code]
      this.itemFormVisible = true
    },
    openAddSubItem: function(row) {
      this.itemFormTitle = '新增子类'
      const path = this.sysPathCode[row.id].path
      this.item = { id: row.id, pid: row.id, path: path, depth: row.depth + 1 }
      this.pcodes = this.sysCode[this.code.code] === undefined ? [] : this.sysCode[this.code.code]
      this.itemFormVisible = true
    },
    saveItem: function() {
      this.$refs.itemForm.validate((valid) => {
        if (valid) {
          this.item.type = this.code.code
          if (this.itemFormTitle === '新增' || this.itemFormTitle === '新增子类') {
            if (this.itemFormTitle === '新增子类') {
              this.item.id = null
            }
            // 排序为当前层级元素个数
            this.item.sort = this.code.items.filter(item => { return item.depth === this.item.depth && item.pid === this.item.pid }).length
            delete this.item.depth
            addItem(this.item).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.itemForm.resetFields()
              this.item = {}
              this.refreshCache()
              this.itemFormVisible = false
            })
          } else {
            if (this.item.path.length >= this.tmpPath.length) {
              // 校验所选上级分类是否为原上级分类子类型
              let pass = false
              this.tmpPath.forEach((path, index) => {
                if (this.item.path[index] !== path) {
                  pass = true
                }
              })
              if (!pass) {
                this.$notify({
                  title: WARNING_TIP_TITLE,
                  message: '上级分类不允许为当前类或子类',
                  type: 'warning'
                })
                return false
              }
            }
            if (this.item.path !== undefined && this.item.path.length > 0) {
              this.item.pid = this.item.path[this.item.path.length - 1]
            } else {
              this.item.pid = 0
            }
            delete this.item.folderType
            delete this.item.indent
            delete this.item.depth
            editItem(this.item).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: EDIT_SUCCESS,
                type: 'success'
              })
              this.$refs.itemForm.resetFields()
              this.item = {}
              this.refreshCache()
              this.itemFormVisible = false
            })
          }
        }
      })
    },
    removeItem: function(index, row) {
      this.$confirm('确定删除该项目', '提示', { type: 'warning' }).then(() => {
        // 检查是否包含下级
        let canRemove = true
        this.codes.forEach(code => {
          code.items.forEach(item => {
            if (item.pid === row.id) {
              this.$notify({
                title: WARNING_TIP_TITLE,
                message: '请先删除子项目',
                type: 'warning'
              })
              canRemove = false
            }
          })
        })
        if (!canRemove) {
          return
        }
        removeItem(row.id).then(res => {
          if (res.status === 204) {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '该项目已被业务数据引用',
              type: 'warning'
            })
          } else {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: REMOVE_SUCCESS,
              type: 'success'
            })
            this.refreshCache()
          }
        })
      }).catch(() => {})
    },
    // 置顶
    moveTop: function(row) {
      moveTopCodeItem(row.id, row.pid).then(res => {
        this.refreshCache()
      })
    },
    cancelItemForm: function() {
      this.$refs.itemForm.resetFields()
      this.item = {}
      this.itemFormVisible = false
    },
    // 刷新缓存
    refreshCache: function() {
      loadSysCode().then(res => {
        this.$store.commit('ADD_SYS_CODE', res.data)
        loadSysPathCode().then(res => {
          this.$store.commit('ADD_SYS_PATH_CODE', res.data)
          this.loadCode()
        })
      })
    }
  },
  mounted() {
    this.loadCode()
  }
}
</script>

