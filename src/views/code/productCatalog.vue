<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="2" :offset="22">
        <el-form @submit.native.prevent>
          <el-form-item>
            <el-button type="primary" @click="openAdd" size="small">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="productCatalogs" highlight-current-row border style="width: 100%;">
      <el-table-column prop="showName" label="名称"></el-table-column>
      <el-table-column align="center" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" @click="openEdit(scope.$index, scope.row)" size="small">编辑</el-button>
            <el-button type="danger" @click="remove(scope.$index, scope.row.id)" size="small">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 -->
    <el-dialog :title="formTitle" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="productCatalog" :rules="formRules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级分类">
              <el-cascader
                expand-trigger="hover"
                :options="pcodes"
                clearable
                :props="selProps"
                v-model="productCatalog.path"
                change-on-select
                :disabled="formTitle != '新增'">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="productCatalog.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
      </div>
  </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadProductCatalog, addProductCatalog, editProductCatalog, removeProductCatalog } from '@/api/code/productcatalog'
import { loadAppCascadePathCode, loadAppCascadeCode } from '@/api/sys/code'
import { SAVE_SUCCESS, EDIT_SUCCESS, REMOVE_SUCCESS, SUCCESS_TIP_TITLE, WARNING_TIP_TITLE } from '@/utils/constant'

export default {

  data() {
    const validateName = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        return callback(new Error('请输入名称'))
      }
      // 校验唯一性
      let isUnique = true
      if (this.formTitle === '新增') {
        this.productCatalogs.forEach(item => {
          if (item.name.toLowerCase() === value.toLowerCase()) {
            isUnique = false
          }
        })
      } else {
        this.productCatalogs.forEach(item => {
          if (item.id !== this.productCatalog.id && item.name.toLowerCase() === value.toLowerCase()) {
            isUnique = false
          }
        })
      }
      if (!isUnique) {
        return callback(new Error('名称不唯一'))
      }
      callback()
    }

    return {
      selProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      productCatalogs: [],
      // ------编辑------
      formVisible: false,
      formTitle: '',
      formRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ]
      },
      productCatalog: {},
      pcodes: []
    }
  },
  computed: {
    ...mapGetters([
      'appCode',
      'appCascadePathCode',
      'appCascadeCode'
    ])
  },
  methods: {
    load: function() {
      loadProductCatalog().then(res => {
        this.productCatalogs = res.data
        this.productCatalogs.forEach(item => {
          let indent = ''
          const depth = this.appCascadePathCode.productCatalog[item.id].path.length - 1
          for (let i = 0; i < depth; i++) {
            indent += '- - '
          }
          if (depth > 0) {
            item.showName = indent + '|- ' + item.name
          } else {
            item.showName = item.name
          }
        })
      })
    },
    openAdd: function() {
      this.formTitle = '新增'
      this.formVisible = true
      this.pcodes = this.appCascadeCode.productCatalog === undefined ? [] : this.appCascadeCode.productCatalog
    },
    openEdit: function(index, row) {
      this.productCatalog = Object.assign({}, row)
      this.formTitle = '编辑'
      const path = this.appCascadePathCode.productCatalog[row.id].path
      path.splice(-1, 1)
      this.productCatalog.path = path
      this.pcodes = this.appCascadeCode.productCatalog === undefined ? [] : this.appCascadeCode.productCatalog
      this.formVisible = true
    },
    save: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.productCatalog.path !== undefined && this.productCatalog.path.length > 0) {
            this.productCatalog.pid = this.productCatalog.path[this.productCatalog.path.length - 1]
          } else {
            this.productCatalog.pid = '0'
          }
          if (this.formTitle === '新增') {
            addProductCatalog(this.productCatalog).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.form.resetFields()
              this.productCatalog = {}
              this.formVisible = false
              this.refreshCache()
            })
          } else {
            editProductCatalog(this.productCatalog).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: EDIT_SUCCESS,
                type: 'success'
              })
              this.$refs.form.resetFields()
              this.productCatalog = {}
              this.formVisible = false
              this.refreshCache()
            })
          }
        }
      })
    },
    remove: function(index, id) {
      this.$confirm('确定删除该类型', '提示', { type: 'warning' }).then(() => {
        // 检查是否包含下级
        let canRemove = true
        this.productCatalogs.forEach(item => {
          if (item.pid === id) {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '请先删除子类型',
              type: 'warning'
            })
            canRemove = false
          }
        })
        if (!canRemove) {
          return
        }
        removeProductCatalog(id).then(res => {
          if (res.status === 204) {
            this.$notify({
              title: WARNING_TIP_TITLE,
              message: '该类型已被业务数据引用，请先清除相关数据',
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
    cancelForm: function() {
      this.$refs.form.resetFields()
      this.productCatalog = {}
      this.formVisible = false
    },
    // 刷新缓存
    refreshCache: function() {
      loadAppCascadePathCode().then(res => {
        this.$store.commit('ADD_APP_CASCADE_PATH_CODE', res.data)
        loadAppCascadeCode().then(subres => {
          this.$store.commit('ADD_APP_CASCADE_CODE', subres.data)
          this.load()
        })
      })
    }
  },
  mounted() {
    this.load()
  }
}
</script>

