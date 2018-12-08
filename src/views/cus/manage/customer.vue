<template>
  <div class="app-container">
    <el-card>
      <el-row>
        <el-form :inline="true" @submit.native.prevent>
          <el-col :span="18">
            <el-form-item>
              <el-select  placeholder="全部级别" v-model="customerGrade">
                <el-option
                  v-for="item in appCode.customerGrade"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="queryParam" placeholder="请输入客户名称/编码/订货账号/联系人/手机" style="width: 330px;">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              &nbsp;&nbsp;高级搜索
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button :disabled="!actions.includes('exportCustomer')">导出</el-button>
              <el-button :disabled="!actions.includes('importCustomer')">导入</el-button>
              <el-button type="primary" :disabled="!actions.includes('addCustomer')" @click="openAdd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!--列表-->
      <el-table :data="customers" highlight-current-row border style="width: 100%;">
        <el-table-column prop="name" label="客户名称" sortable></el-table-column>
        <el-table-column prop="descn" label="客户编码" sortable></el-table-column>
        <el-table-column prop="descn" label="登录账号" sortable></el-table-column>
        <el-table-column prop="descn" label="地区"></el-table-column>
        <el-table-column prop="descn" label="所在部门" sortable></el-table-column>
        <el-table-column prop="descn" label="级别"></el-table-column>
        <el-table-column prop="descn" label="联系人" sortable></el-table-column>
        <el-table-column prop="descn" label="联系方式" sortable></el-table-column>
      </el-table>
    </el-card>

    <!--编辑客户-->
    <el-dialog width="80%" :close-on-click-modal="false" :visible.sync="formVisible" :show-close="false">
      <el-form :model="company" ref="companyForm" :rules="companyRules" label-width="80px">
        <p class="legend-title">公司信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="name">
              <el-input v-model="company.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户级别" prop="grade">
              <el-select v-model="company.grade" style="width:100%">
                <el-option
                  v-for="item in appCode.customerGrade"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户编码" prop="code">
              <el-input v-model="company.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认仓库" prop="defaultWarehouse">
              <el-select v-model="company.defaultWarehouse" style="width:100%">
                <el-option
                  v-for="item in appCode.warehouse"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所在部门" prop="ownerDept">
              <el-cascader
                style="width:100%"
                expand-trigger="hover"
                :options="appCascadeCode.dept"
                :show-all-levels="false"
                :props="selProps"
                v-model="company.ownerDept">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务员" prop="salesman">
              <el-select v-model="company.salesman" style="width:100%">
                <el-option
                  v-for="item in users"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="签约时间">
              <el-date-picker
                style="width:100%"
                v-model="signingDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="邮编" prop="postcode">
                  <el-input v-model="company.postcode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="传真" prop="fax">
                  <el-input v-model="company.fax"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域" prop="areacode">
              <el-cascader
                style="width:100%"
                expand-trigger="hover"
                :options="sysCode.area"
                :props="selProps"
                v-model="company.areacode">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="company.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物流编码" prop="logisticsCode">
              <el-input v-model="company.logisticsCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备用信息" prop="descn">
              <el-input type="textarea" :rows="2" v-model="company.descn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="personal" ref="personalForm" :rules="personalRules" label-width="80px">
        <p class="legend-title">个人信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="personal.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="personal.mobile"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话" prop="tel">
                  <el-input v-model="personal.tel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位" prop="postion">
              <el-input v-model="personal.postion"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="Email" prop="email">
                  <el-input v-model="personal.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="personal.qq"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="account" ref="accountForm" :rules="accountRules" label-width="80px">
        <p class="legend-title">账号信息 <el-checkbox v-model="openAccount"><span style="color:red">开通订货账号</span><span style="color:#606266">（开通订货账号，客户才能进入系统订货）</span></el-checkbox></p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="account">
              <el-input :disabled="!openAccount" v-model="account.account"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="pwd">
              <el-input :disabled="!openAccount" type="password" v-model="account.pwd"></el-input>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.weak}">弱</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.middle}">中</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
              <el-tag size="mini" color="#e9ecf3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span :style="{color: pwdColor.strong}">强</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input :disabled="!pwdValid" type="password" v-model="account.confirmPwd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form :model="financial" ref="financialForm" :rules="financialRules" label-width="80px">
        <p class="legend-title">财务信息</p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发票抬头" prop="invoiceTitle">
              <el-input v-model="financial.invoiceTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人识别号" prop="nsrsbh">
              <el-input v-model="financial.nsrsbh"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="financial.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="tel">
              <el-input v-model="financial.tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开户名称" prop="bankAccountName">
              <el-input v-model="financial.bankAccountName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行" prop="bankName">
              <el-input v-model="financial.bankName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input v-model="financial.bankAccount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账期类型" prop="accountPeriod">
              <el-select v-model="financial.accountPeriod" style="width:100%">
                <el-option
                  v-for="item in appCode.accountPeriod"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上次对账日期" prop="reconcileDate">
              <el-input v-model="financial.reconcileDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对账初始化" prop="initReconcile">
              <el-input v-model="financial.initReconcile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align:center" class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loadAllUser } from '@/api/bas/user'
import { addCustomer } from '@/api/cus/customer'
import { SAVE_SUCCESS, SUCCESS_TIP_TITLE } from '@/utils/constant'
import { validateMobile, validatePassword, validateEmail, validateQQ, validateTel, validatePostcode } from '@/utils/validate'

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
      } else if (value.trim() !== this.account.pwd.trim()) {
        this.account.confirmPwd = ''
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
    const checkTel = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validateTel(value)) {
          return callback(new Error('电话号码格式不正确'))
        }
      }
      callback()
    }
    const checkPostcode = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validatePostcode(value)) {
          return callback(new Error('邮政编码格式不正确'))
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
      actions: this.$store.state.permission.menus[this.$route.name],
      total: 0,
      params: {
        order: 'desc',
        orderField: 'createdTime',
        pageNum: 1,
        pageSize: 10
      },
      queryParam: '',
      customers: [],
      customerGrade: '',
      // ------编辑------
      // 公司
      formTitle: '',
      formVisible: false,
      users: [],
      signingDate: '',
      company: {},
      companyRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 40, message: '最大长度40个字符', trigger: 'blur' }
        ],
        grade: [
          { required: true, message: '客户级别不能为空', trigger: 'blur' }
        ],
        defaultWarehouse: [
          { required: true, message: '默认仓库不能为空', trigger: 'blur' }
        ],
        ownerDept: [
          { required: true, message: '所在部门不能为空', trigger: 'blur' }
        ],
        postcode: [
          { trigger: 'blur', validator: checkPostcode }
        ],
        fax: [
          { trigger: 'blur', validator: checkTel }
        ],
        logisticsCode: [
          { max: 32, message: '最大长度32个字符', trigger: 'blur' }
        ],
        address: [
          { max: 40, message: '最大长度40个字符', trigger: 'blur' }
        ],
        descn: [
          { max: 255, message: '最大长度255个字符', trigger: 'blur' }
        ]
      },
      // 个人
      personal: {},
      personalRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { max: 20, message: '最大长度20个字符', trigger: 'blur' }
        ],
        postion: [
          { max: 10, message: '最大长度10个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, trigger: 'blur', validator: checkMobile }
        ],
        qq: [
          { trigger: 'blur', validator: checkQQ }
        ],
        email: [
          { trigger: 'blur', validator: checkEmail }
        ],
        tel: [
          { trigger: 'blur', validator: checkTel }
        ]
      },
      // 账号
      openAccount: false,
      account: {},
      accountRules: {
        account: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { max: 20, message: '最大长度20个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        confirmPwd: [
          { required: true, validator: checkConfirmPassword, trigger: 'blur' }
        ]
      },
      pwdColor: {
        weak: '#fff',
        middle: '#fff',
        strong: '#fff'
      },
      pwdValid: false,
      // 财务
      financial: {},
      financialRules: {
        invoiceTitle: [
          { max: 30, message: '最大长度30个字符', trigger: 'blur' }
        ],
        nsrsbh: [
          { max: 20, message: '最大长度20个字符', trigger: 'blur' }
        ],
        address: [
          { max: 80, message: '最大长度80个字符', trigger: 'blur' }
        ],
        tel: [
          { trigger: 'blur', validator: checkTel }
        ],
        bankAccountName: [
          { max: 40, message: '最大长度40个字符', trigger: 'blur' }
        ],
        bankName: [
          { max: 64, message: '最大长度64个字符', trigger: 'blur' }
        ],
        bankAccount: [
          { max: 50, message: '最大长度50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sysCode',
      'appCode',
      'appCascadeCode'
    ])
  },
  methods: {
    queryByPage: function() {

    },
    openAdd: function() {
      this.customer = {}
      this.formTitle = '新增'
      this.formVisible = true
    },
    save: function() {
      let allVaild = true
      this.$refs.companyForm.validate(valid => {
        allVaild = allVaild && valid
      })
      this.$refs.personalForm.validate(valid => {
        allVaild = allVaild && valid
      })
      this.$refs.financialForm.validate(valid => {
        allVaild = allVaild && valid
      })
      if (this.openAccount) {
        this.$refs.accountForm.validate(valid => {
          allVaild = allVaild && valid
        })
      }
      if (allVaild) {
        addCustomer(this.company, this.personal, this.account, this.financial).then(res => {
          this.$notify({
            title: SUCCESS_TIP_TITLE,
            message: SAVE_SUCCESS,
            type: 'success'
          })
        })
      }
    },
  },
  mounted() {
    loadAllUser().then(res => {
      this.users = res.data
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .legend-title {
    color: #03b8cc;
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 30px;
  }
</style>