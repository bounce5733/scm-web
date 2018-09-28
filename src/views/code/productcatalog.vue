<template>
  <div class="app-container">
    <el-form @submit.native.prevent :inline="true">
      <el-form-item>
        <el-button type="primary" @click="openAdd" size="small">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="products" highlight-current-row border style="width: 100%;">
      <el-table-column prop="name" label="名称" width="300"></el-table-column>
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
      <el-form :model="items" :rules="formRules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级分类">
              <el-cascader
                expand-trigger="hover"
                :options="pcodes"
                clearable
                :props="selProps"
                v-model="item.path"
                change-on-select
                :disabled="formTitle != '新增'">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="item.showName"></el-input>
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
import { loadProductCatalog, addProductCatalog, editProductCatalog, removeProductCatalog } from '@/api/code/productcatalog'
import { SAVE_SUCCESS, EDIT_SUCCESS, REMOVE_SUCCESS, SUCCESS_TIP_TITLE, WARNING_TIP_TITLE } from '@/utils/constant'

export default {

  data() {
    const validateName = (rule, value, callback) => {
      if (value === undefined || value.trim().length === 0) {
        return callback(new Error('请输入名称'))
      }
      // 校验唯一性
      let isUnique = true
      this.products.forEach(item => {
        if (item.name.toLowerCase() === value.toLowerCase()) {
          isUnique = false
        }
      })
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
      products: [],
      // ------编辑------
      formVisible: false,
      formTitle: '',
      formRules: {
        name: [
          { required: true, trigger: 'blur', validator: validateName }
        ]
      },
      product: {},
      pcodes: []
    }
  },
  methods: {
    load: function() {
      loadProductCatalog().then(res => {
        this.products = res.data
        this.products.forEach(item => {
          let indent = ''
          const depth = this.$store.state.code.codePathMap[item.id].path.length - 1
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
      this.pcodes = this.$store.state.code.codes[this.code.code] === undefined ? [] : this.$store.state.code.codes[this.code.code]
    },
    openEdit: function(index, row) {
      this.product = Object.assign({}, row)
      this.formTitle = '编辑'
      const path = this.$store.state.code.codePathMap[row.id].path
      path.splice(-1, 1)
      this.product.path = path
      this.pcodes = this.$store.state.code.codes[this.code.code] === undefined ? [] : this.$store.state.code.codes[this.code.code]
      this.formVisible = true
    },
    save: function() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.product.path !== undefined && this.product.path.length > 0) {
            this.product.pid = this.product.path[this.product.path.length - 1]
          } else {
            this.product.pid = '0'
          }
          if (this.formTitle === '新增') {
            addProductCatalog(this.prodcut).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: SAVE_SUCCESS,
                type: 'success'
              })
              this.$refs.form.resetFields()
              this.product = {}
              this.load()
              this.formVisible = false
            })
          } else {
            editProductCatalog(this.prodcut).then(res => {
              this.$notify({
                title: SUCCESS_TIP_TITLE,
                message: EDIT_SUCCESS,
                type: 'success'
              })
              this.$refs.form.resetFields()
              this.product = {}
              this.load()
              this.formVisible = false
            })
          }
        }
      })
    },
    remove: function(index, row) {
      this.$confirm('确定删除该类型', '提示', { type: 'warning' }).then(() => {
        // 检查是否包含下级
        let canRemove = true
        this.products.forEach(item => {
          if (item.pid === row.id) {
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
        removeProductCatalog(row.id).then(res => {
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
            this.load()
          }
        })
      }).catch(() => {})
    },
    cancelForm: function() {
      this.$refs.form.resetFields()
      this.product = {}
      this.formVisible = false
    }
  },
  mounted() {
    this.load()
  }
}
</script>

