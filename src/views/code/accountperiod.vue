<template>
  <div class="app-container">
    <el-card>
      <el-row>
        <el-form @submit.native.prevent>
          <el-col :span="2" :offset="22">
            <el-form-item>
              <el-button type="primary" size="small" :disabled="!actions.includes('addAccountPeriod')" @click="openAdd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-table :data="accountPeriods" border style="width: 100%;">
        <el-table-column prop="name" label="名称" sortable>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" :disabled="!actions.includes('editAccountPeriod')" icon="el-icon-edit" @click="openEdit(scope.row)" size="small">修改</el-button>
              <el-button type="primary" :disabled="!actions.includes('moveTopAccountPeriod')" icon="el-icon-upload2" @click="moveTop(scope.row.id)" size="small">置顶</el-button>
              <el-button type="danger" :disabled="!actions.includes('removeAccountPeriod')" icon="el-icon-remove" @click="remove(scope.row.id)" size="small">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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
import { loadAppCode } from '@/api/console/code'
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
      actions: this.$store.state.permission.menus[this.$route.name],
      accountPeriods: [],
      // ------编辑------
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
    openAdd: function() {
      this.accountPeriod = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    openEdit: function(item) {
      this.oldName = item.name
      this.accountPeriod = Object.assign({}, item)
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
              this.refreshCache()
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
              this.refreshCache()
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    moveTop: function(id) {
      moveTopAccountPeriod(id).then(res => {
        this.refreshCache()
        this.load()
      })
    },
    remove: function(id) {
      this.$confirm('确定删除该账期类型', '提示', { type: 'warning' }).then(() => {
        removeAccountPeriod(id).then(res => {
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
      this.$refs.accountPeriodForm.resetFields()
      this.formVisible = false
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

