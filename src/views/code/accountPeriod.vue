<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="2" :offset="22">
        <el-form @submit.native.prevent>
          <el-form-item>
            <el-button type="primary" size="small" @click="openAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table :data="accountPeriods" border style="width: 100%;">
        <el-table-column prop="name" label="账期类型" sortable>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-dropdown placement="bottom" @command="handleAction" @visible-change="accountPeriod = Object.assign({}, scope.row)">
              <i class="el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit"><i class="el-icon-edit"></i>&nbsp;修改</el-dropdown-item>
                <el-dropdown-item command="moveTop" divided><i class="el-icon-upload2"></i>&nbsp;置顶</el-dropdown-item>
                <el-dropdown-item command="remove" divided><i class="el-icon-delete"></i>&nbsp;删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!--编辑账期-->
    <el-dialog :title="formTitle" width="40%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="accountPeriod" ref="accountPeriodForm" :rules="accountPeriodRules" label-width="80px">
        <el-form-item label="账期类型" prop="name">
          <el-input v-model="accountPeriod.name"></el-input>
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
import { loadAccountPeriod, addAccountPeriod, editAccountPeriod, removeAccountPeriod, moveTopAccountPeriod } from '@/api/code/accountPeriod'
import { SUCCESS_TIP_TITLE, SAVE_SUCCESS, REMOVE_SUCCESS } from '@/utils/constant'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        return callback(new Error('名称不能为空'))
      }
      // 唯一性
      let isUnique = true
      if (this.formTitle === '新增') {
        this.accountPeriods.forEach(item => {
          if (item.name.trim() === value.trim()) {
            isUnique = false
          }
        })
      } else { // 比较自己除外
        if (value !== this.oldName) {
          this.accountPeriods.forEach(item => {
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

    return {
      accountPeriods: [],
      // ------仓库编辑------
      accountPeriod: {},
      formTitle: '',
      formVisible: false,
      oldName: '',
      accountPeriodRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName },
          { max: 24, message: '最大长度24个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    load: function() {
      loadAccountPeriod().then(res => {
        this.accountPeriods = res.data
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
          this.remove()
      }
    },
    openAdd: function() {
      this.accountPeriod = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    openEdit: function() {
      this.oldName = this.accountPeriod.name
      this.formTitle = '编辑'
      this.formVisible = true
    },
    save: function() {
      this.$refs.accountPeriodForm.validate((valid) => {
        if (valid) {
          if (this.formTitle === '新增') {
            this.accountPeriod.sort = this.accountPeriods.length
            addAccountPeriod(this.accountPeriod).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.accountPeriodForm.resetFields()
              this.load()
              this.formVisible = false
            })
          } else {
            editAccountPeriod(this.accountPeriod).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.accountPeriodForm.resetFields()
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    moveTop: function() {
      moveTopAccountPeriod(this.accountPeriod.id).then(res => {
        this.load()
      })
    },
    remove: function() {
      this.$confirm('确定删除该账期类型', '提示', { type: 'warning' }).then(() => {
        removeAccountPeriod(this.accountPeriod.id).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: REMOVE_SUCCESS,
            type: 'success'
          })
          this.load()
        })
      }).catch(() => {})
    },
    cancelForm: function() {
      this.$refs.accountPeriodForm.resetFields()
      this.formVisible = false
    }
  },
  mounted() {
    this.load()
  }
}
</script>

