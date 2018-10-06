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
    <el-table :data="productCatalogs" :show-header="false" highlight-current-row border style="width: 100%;">
      <el-table-column>
        <template slot-scope="scope">
          <el-row>
            <el-col :span="18">
              <span>{{scope.row.showName}}</span>
            </el-col>
            <el-col :span="6">
              <el-button-group>
                <el-button type="primary" @click="openAddItem(scope.row)" icon="el-icon-plus" size="small">新增子类</el-button>
                <el-button type="primary" @click="openEdit(scope.$index, scope.row)" icon="el-icon-edit" size="small">编辑</el-button>
                <el-button type="danger" @click="remove(scope.$index, scope.row.id)" icon="el-icon-remove" size="small">删除</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑 -->
    <el-dialog :title="formTitle" :visible.sync="formVisible" width="50%" :close-on-click-modal="false">
      <el-form :model="productCatalog" :rules="formRules" label-width="80px" ref="form">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="productCatalog.name"></el-input>
        </el-form-item>
        <el-form-item label="上级分类" prop="path">
          <el-cascader style="width:100%"
            expand-trigger="hover"
            :options="pcodes"
            clearable
            :props="selProps"
            v-model="productCatalog.path"
            change-on-select
            @change="changeDepth"
            :disabled="formTitle === '新增' || formTitle === '新增子类'">
          </el-cascader>
        </el-form-item>
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
    // 检查名称是否重复
    const checkUnique = function(codes, pid, id, name, depth) {
      let isunique = true
      codes.forEach(code => {
        if (pid === code.pid && code.id !== id && depth === code.depth && code.name === name) {
          isunique = false
        }
      })
      return isunique
    }

    const validateName = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        return callback(new Error('分类名称不能为空'))
      }
      // 校验分类名称唯一性
      let isUnique = true
      if (this.formTitle === '新增') { // 校验顶级字典名称是否重复
        this.productCatalogs.forEach(item => {
          if (item.depth === 1 && item.name.toLowerCase() === value.toLowerCase()) {
            isUnique = false
          }
        })
      } else if (this.formTitle === '新增子类') { // 校验子类名称是否重复
        isUnique = checkUnique(this.productCatalogs, this.productCatalog.pid, this.productCatalog.id, value, this.productCatalog.depth)
      } else { // 校验当前层级名称是否重复
        if (this.tmpDepth !== -1 && this.tmpPid !== -1) {
          this.productCatalog.depth = this.tmpDepth
          this.productCatalog.pid = this.tmpPid
        }
        isUnique = checkUnique(this.productCatalogs, this.productCatalog.pid, this.productCatalog.id, value, this.productCatalog.depth)
      }
      if (!isUnique) {
        return callback(new Error('分类名称不能重复'))
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
      pcodes: [],
      pname: '',
      tmpDepth: -1, // 用于编辑类型时候临时记录级联下拉框所变值depth
      tmpPid: -1 // 用于编辑类型时候临时记录级联下拉框所变值id
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
          item.depth = this.appCascadePathCode.productCatalog[item.id].path.length
          if (item.depth > 1) {
            let indent = ''
            for (let i = 1; i < item.depth; i++) {
              indent += '- - '
            }
            item.showName = indent + '|- ' + item.name
          } else {
            item.showName = item.name
          }
        })
      })
    },
    openAdd: function() {
      this.productCatalog = { depth: 1 }
      this.formTitle = '新增'
      this.formVisible = true
      this.productCatalog.pid = 0
    },
    openAddItem: function(row) {
      this.formTitle = '新增子类'
      const path = this.appCascadePathCode.productCatalog[row.id].path
      this.productCatalog = { id: row.id, pid: row.id, path: path, depth: row.depth + 1 }
      this.pcodes = this.appCascadeCode.productCatalog === undefined ? [] : this.appCascadeCode.productCatalog
      this.formVisible = true
    },
    openEdit: function(index, row) {
      this.productCatalog = Object.assign({}, row)
      this.tmpDepth = -1
      this.tmpPid = -1
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
          delete this.productCatalog.depth
          if (this.productCatalog.path !== undefined && this.productCatalog.path.length > 0) {
            this.productCatalog.pid = this.productCatalog.path[this.productCatalog.path.length - 1]
          } else {
            this.productCatalog.pid = 0
          }
          if (this.formTitle === '新增' || this.formTitle === '新增子类') {
            if (this.formTitle === '新增子类') {
              this.productCatalog.id = null
            }
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
    },
    // 记录上级分类修改时的depth/pid
    changeDepth: function(val) {
      this.tmpDepth = val.length + 1
      this.tmpPid = val[val.length - 1]
    }
  },
  mounted() {
    this.load()
  }
}
</script>

