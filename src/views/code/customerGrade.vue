<template>
  <div class="app-container">
    <el-card>
      <div>
        <el-row>
          <el-col :span="2" :offset="22">
            <el-form @submit.native.prevent>
              <el-form-item>
                <el-button type="primary" size="small" :disabled="!actions.includes('addCustomerGrade')" @click="openAdd">新增</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table :data="customerGrades" border style="width: 100%;">
          <el-table-column :formatter="formatNameCol" prop="name" label="级别名称" sortable>
          </el-table-column>
          <el-table-column :formatter="formatDiscountCol" prop="discount" label="订货折扣" sortable>
          </el-table-column>
          <el-table-column label="操作" align="center" width="60">
            <template slot-scope="scope">
              <el-dropdown placement="bottom" @command="handleAction" @visible-change="customerGrade = Object.assign({}, scope.row)">
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit" :disabled="!actions.includes('editCustomerGrade')"><i class="el-icon-edit"></i>&nbsp;修改</el-dropdown-item>
                  <el-dropdown-item command="moveTop" :disabled="!actions.includes('moveTopCustomerGrade')"  divided><i class="el-icon-upload2"></i>&nbsp;置顶</el-dropdown-item>
                  <el-dropdown-item command="remove" :disabled="!actions.includes('removeCustomerGrade')"  divided><i class="el-icon-delete"></i>&nbsp;删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--编辑-->
    <el-dialog title="新增" width="40%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="customerGrade" ref="customerGradeForm" :rules="customerGradeRules" label-width="80px">
        <el-form-item label="级别名称" prop="name">
          <el-input v-model="customerGrade.name"></el-input>
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input v-model="customerGrade.discount">
          <i slot="suffix">%</i>
          </el-input>
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
import { loadCustomerGrade, addCustomerGrade, editCustomerGrade, removeCustomerGrade, moveTopCustomerGrade } from '@/api/code/customerGrade'
import { loadAppCode } from '@/api/console/code'
import { SUCCESS_TIP_TITLE, WARNING_TIP_TITLE, SAVE_SUCCESS, REMOVE_SUCCESS, EDIT_SUCCESS } from '@/utils/constant'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        return callback(new Error('名称不能为空'))
      }
      // 唯一性
      let isUnique = true
      if (this.formTitle === '新增') {
        this.customerGrades.forEach(item => {
          if (item.name.trim() === value.trim()) {
            isUnique = false
          }
        })
      } else {
        if (value !== this.oldName) {
          this.customerGrades.forEach(item => {
            if (value.trim() === item.name) {
              isUnique = false
            }
          })
        }
      }
      if (!isUnique) {
        return callback(new Error('名称重复'))
      }
      callback()
    }

    const validateDiscount = (rule, value, callback) => {
      if (!value || isNaN(value) || parseFloat(value) > 100) {
        return callback(new Error('请输入小于100的数字'))
      }
      callback()
    }

    return {
      actions: this.$store.state.permission.menus[this.$route.name],
      customerGrades: [],
      // ------编辑------
      customerGrade: {},
      formVisible: false,
      customerGradeRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName },
          { max: 8, message: '最大长度8个字符', trigger: 'blur' }
        ],
        discount: [
          { required: true, trigger: 'blur', validator: validateDiscount }
        ]
      }
    }
  },
  methods: {
    load: function() {
      loadCustomerGrade().then(res => {
        this.customerGrades = res.data
      })
    },
    handleAction: function(action) {
      switch (action) {
        case 'edit':
          this.openEdit()
          break
        case 'moveTop':
          this.moveTop()
          break
        case 'remove':
          if (this.customerGrade.defaulted === 'T') {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '默认级别不允许删除',
              type: 'warning'
            })
          } else {
            this.remove()
          }
      }
    },
    openAdd: function() {
      this.customerGrade = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    openEdit: function() {
      this.oldName = this.customerGrade.name
      this.formTitle = '编辑'
      this.formVisible = true
    },
    save: function() {
      this.$refs.customerGradeForm.validate((valid) => {
        if (valid) {
          if (this.formTitle === '新增') {
            this.customerGrade.sort = this.customerGrades.length
            addCustomerGrade(this.customerGrade).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.customerGradeForm.resetFields()
              this.refreshCache()
              this.load()
              this.formVisible = false
            })
          } else {
            editCustomerGrade(this.customerGrade).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: EDIT_SUCCESS,
                type: 'success'
              })
              this.$refs.customerGradeForm.resetFields()
              this.refreshCache()
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    moveTop: function() {
      moveTopCustomerGrade(this.customerGrade.id).then(res => {
        this.refreshCache()
        this.load()
      })
    },
    remove: function() {
      this.$confirm('确定删除该客户级别', '提示', { type: 'warning' }).then(() => {
        removeCustomerGrade(this.customerGrade.id).then(res => {
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
      this.$refs.customerGradeForm.resetFields()
      this.formVisible = false
    },
    // 刷新缓存
    refreshCache: function() {
      loadAppCode().then(res => {
        this.$store.commit('ADD_APP_CODE', res.data)
        this.load()
      })
    },
    formatDiscountCol: function(row, column, cellValue, index) {
      return cellValue + '%'
    },
    formatNameCol: function(row, column, cellValue, index) {
      return row.defaulted === 'F' ? cellValue : cellValue + '（系统默认，不可删除）'
    }
  },
  mounted() {
    this.load()
  }
}
</script>

