<template>
  <div class="app-container">
    <el-card>
      <el-row>
        <el-form @submit.native.prevent>
          <el-col :span="2" :offset="22">
            <el-form-item>
              <el-button type="primary" size="small" :disabled="!actions.includes('addUnit')" @click="openAdd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-table :data="units" border style="width: 100%;">
        <el-table-column prop="name" label="名称" sortable>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" :disabled="!actions.includes('moveTopUnit')" icon="el-icon-upload2" @click="moveTop(scope.row.id)" size="small">置顶</el-button>
              <el-button type="danger" :disabled="!actions.includes('removeUnit')" icon="el-icon-remove" @click="remove(scope.row.id)" size="small">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--编辑计量单位-->
    <el-dialog title="新增" width="40%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="unit" ref="unitForm" :rules="unitRules" label-width="80px">
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="unit.name"></el-input>
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
import { loadUnit, addUnit, removeUnit, moveTopUnit } from '@/api/code/unit'
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
      this.units.forEach(item => {
        if (item.name.trim() === value.trim()) {
          isUnique = false
        }
      })
      if (!isUnique) {
        return callback(new Error('名称重复'))
      }
      callback()
    }

    return {
      actions: this.$store.state.permission.menus[this.$route.name],
      units: [],
      // ------编辑------
      unit: {},
      formVisible: false,
      unitRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName },
          { max: 12, message: '最大长度12个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    load: function() {
      loadUnit().then(res => {
        this.units = res.data
      })
    },
    openAdd: function() {
      this.unit = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    save: function() {
      this.$refs.unitForm.validate((valid) => {
        if (valid) {
          this.unit.sort = this.units.length
          addUnit(this.unit).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: SAVE_SUCCESS,
              type: 'success'
            })
            this.$refs.unitForm.resetFields()
            this.refreshCache()
            this.load()
            this.formVisible = false
          })
        }
      })
    },
    moveTop: function(id) {
      moveTopUnit(id).then(res => {
        this.refreshCache()
        this.load()
      })
    },
    remove: function(id) {
      this.$confirm('确定删除该计量单位', '提示', { type: 'warning' }).then(() => {
        removeUnit(id).then(res => {
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
      this.$refs.unitForm.resetFields()
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

