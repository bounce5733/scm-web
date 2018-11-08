<template>
  <div class="app-container">
    <el-card>
      <el-row>
        <el-col :span="2" :offset="22">
          <el-form @submit.native.prevent>
            <el-form-item>
              <el-button type="primary" size="small" :disabled="!actions.includes('addWarehouse')" @click="openAdd">新增</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-table :data="warehouses" border style="width: 100%;">
        <el-table-column prop="name" label="仓库名称" width="160" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.defaulted === 'T'">{{scope.row.name}}&nbsp;&nbsp;<el-tag color="#7a8aa2" size="mini"><span style="color:white">默认</span></el-tag></span>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="仓库编码" sortable></el-table-column>
        <el-table-column prop="address" label="仓库地址" sortable></el-table-column>
        <el-table-column prop="enabled" :formatter="formatterEnabledCol" label="状态" sortable></el-table-column>
        <el-table-column fixed="right" align="center" width="60">
          <template slot-scope="scope">
            <el-dropdown placement="bottom" @command="handleAction" @visible-change="warehouse = Object.assign({}, scope.row)">
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" :disabled="!actions.includes('editWarehouse')"><i class="el-icon-edit"></i>&nbsp;修改</el-dropdown-item>
                <el-dropdown-item command="moveTop" :disabled="!actions.includes('moveTopWarehouse')"  divided><i class="el-icon-upload2"></i>&nbsp;置顶</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.enabled === 'T'" :disabled="!actions.includes('enableWarehouse')" command="disable" divided><i class="el-icon-remove"></i>&nbsp;禁用</el-dropdown-item>
                <el-dropdown-item v-else command="enable" :disabled="!actions.includes('enableWarehouse')" divided><i class="el-icon-circle-check"></i>&nbsp;启用</el-dropdown-item>
                <el-dropdown-item command="remove" :disabled="!actions.includes('removeWarehouse')"  divided><i class="el-icon-delete"></i>&nbsp;删除</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.defaulted === 'F'" :disabled="!actions.includes('setDefaultWarehouse')" command="setDefault" divided><i class="el-icon-setting"></i>&nbsp;设置为默认仓库</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--编辑仓库-->
    <el-dialog :title="formTitle" width="40%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="warehouse" ref="warehouseForm" :rules="warehouseRules" label-width="80px">
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="warehouse.name"></el-input>
        </el-form-item>
        <el-form-item label="仓库编码" prop="code">
          <el-input v-model="warehouse.code"></el-input>
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input type="textarea" :rows="2" v-model="warehouse.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelForm">取消</el-button>
        <el-button type="primary" @click.native="save">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { loadWarehouse, addWarehouse, editWarehouse, removeWarehouse, setDefaultWarehouse, enableWarehouse, moveTopWarehouse } from '@/api/code/warehouse'
import { loadAppCode } from '@/api/console/code'
import { SUCCESS_TIP_TITLE, WARNING_TIP_TITLE, SAVE_SUCCESS, REMOVE_SUCCESS } from '@/utils/constant'

export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        return callback(new Error('编码不能为空'))
      }
      // 唯一性
      let isUnique = true
      if (this.formTitle === '新增') {
        this.warehouses.forEach(item => {
          if (item.code.trim() === value.trim()) {
            isUnique = false
          }
        })
      } else { // 比较自己除外
        if (value !== this.oldCode) {
          this.warehouses.forEach(item => {
            if (value.trim() === item.code) {
              isUnique = false
            }
          })
        }
      }
      if (!isUnique) {
        return callback(new Error('编码重复'))
      }
      callback()
    }

    return {
      actions: this.$store.state.permission.menus[this.$route.name],
      warehouses: [],
      // ------编辑------
      warehouse: {},
      formTitle: '',
      formVisible: false,
      oldCode: '',
      warehouseRules: {
        code: [
          { required: true, trigger: 'blur', validator: validateCode },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '名称不能为空' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        address: [
          { max: 255, message: '最大长度255个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    load: function() {
      loadWarehouse().then(res => {
        this.warehouses = res.data
      })
    },
    handleAction: function(action) {
      switch (action) {
        case 'edit':
          this.openEdit()
          break
        case 'disable':
          if (this.warehouse.defaulted === 'T') {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '默认仓库不允许禁用',
              type: 'warning'
            })
          } else {
            this.changeStatus('F')
          }
          break
        case 'moveTop':
          this.moveTop()
          break
        case 'setDefault':
          this.setDefault()
          break
        case 'enable':
          this.changeStatus('T')
          break
        case 'remove':
          if (this.warehouse.defaulted === 'T') {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '默认仓库不允许删除',
              type: 'warning'
            })
          } else {
            this.remove()
          }
      }
    },
    openAdd: function() {
      this.warehouse = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    openEdit: function() {
      this.oldCode = this.warehouse.code
      this.formTitle = '编辑'
      this.formVisible = true
    },
    save: function() {
      this.$refs.warehouseForm.validate((valid) => {
        if (valid) {
          if (this.formTitle === '新增') {
            addWarehouse(this.warehouse).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.warehouseForm.resetFields()
              this.refreshCache()
              this.load()
              this.formVisible = false
            })
          } else {
            editWarehouse(this.warehouse).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.warehouseForm.resetFields()
              this.refreshCache()
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    changeStatus: function(status) {
      const tip = status === 'F' ? '是否确认禁用此仓库，特别提醒: 作废仓库不会清空仓库库存' : '是否确认启用此仓库'
      this.$confirm(tip, '提示', { type: 'warning' }).then(() => {
        enableWarehouse(this.warehouse.id, status).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: '仓库状态修改成功',
            type: 'success'
          })
          this.refreshCache()
          this.load()
        })
      })
    },
    setDefault: function() {
      this.$confirm('确认将此仓库设置为默认仓吗', '提示', { type: 'warning' }).then(() => {
        setDefaultWarehouse(this.warehouse.id).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: '设置成功',
            type: 'success'
          })
          this.refreshCache()
          this.load()
        })
      })
    },
    moveTop: function() {
      moveTopWarehouse(this.warehouse.id).then(res => {
        this.refreshCache()
        this.load()
      })
    },
    remove: function() {
      this.$confirm('确定删除该仓库', '提示', { type: 'warning' }).then(() => {
        removeWarehouse(this.warehouse.id).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: REMOVE_SUCCESS,
            type: 'success'
          })
          this.refreshCache()
          this.load()
        })
      }).catch(() => {})
    },
    cancelForm: function() {
      this.$refs.warehouseForm.resetFields()
      this.formVisible = false
    },
    formatterEnabledCol: function(row, column, cellValue, index) {
      return cellValue === 'T' ? '已启用' : '未启用'
    },
    // 刷新缓存
    refreshCache: function() {
      loadAppCode().then(res => {
        this.$store.commit('ADD_APP_CODE', res.data)
        this.load()
      })
    }
  },
  mounted() {
    this.load()
  }
}
</script>

