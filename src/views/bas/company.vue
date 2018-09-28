<template>
  <div class="app-container">
    <el-card>
      <div>
          <el-row>
            <el-col :span="4"><p class="legend-title">基础信息</p></el-col>
            <el-col :offset="18" :span="2">
              <el-button type="primary" @click.native="save">保存</el-button>
            </el-col>
          </el-row>
        <el-form @submit.native.prevent :model="company" ref="companyForm" :rules="companyRules" label-width="80px">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="公司名称" prop="name">
                <el-input v-model="company.name"></el-input>
              </el-form-item>
              <el-form-item label="行业类别" prop="industryCategory">
                <el-cascader style="width:100%"
                  expand-trigger="hover"
                  :options="industryCategorys"
                  clearable
                  :props="selProps"
                  v-model="company.industryCategory">
                </el-cascader>
              </el-form-item>
              <el-form-item label="区域" prop="area">
                <el-cascader style="width:100%"
                  expand-trigger="hover"
                  :options="areas"
                  clearable
                  :props="selProps"
                  v-model="company.area">
                </el-cascader>
              </el-form-item>
              <el-form-item label="邮编" prop="postcode">
                <el-input v-model="company.postcode" placeholder="请输入邮编"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人" prop="linkmanName">
                    <el-input v-model="company.linkmanName" placeholder="请输入联系人名字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职位" prop="linkmanPosition">
                    <el-input v-model="company.linkmanPosition" placeholder="请输入联系人职位名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手机" prop="linkmanMobile">
                    <el-input v-model="company.linkmanMobile" placeholder="请输入联系人手机号码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="QQ" prop="linkmanQq">
                    <el-input v-model="company.linkmanQq" placeholder="请输入联系人QQ号码"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="邮箱" prop="linkmanEmail">
                <el-input v-model="company.linkmanEmail" placeholder="请输入联系人邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司logo">
                <el-upload
                  list-type="picture-card"
                  :action="companyAvatarAction"
                  :headers="companyAvatarHeader"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="avatar" :src="avatar" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="company.address" placeholder="请输入公司详细地址"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="电话" prop="tel">
                    <el-input v-model="company.tel" placeholder="请输入公司电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传真" prop="fax">
                    <el-input v-model="company.fax" placeholder="请输入公司传真"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="公司网址" prop="webSite">
                <el-input v-model="company.webSite" placeholder="请输入公司网址"></el-input>
              </el-form-item>
              <el-form-item label="公司介绍" prop="descn">
                <el-input type="textarea" :rows="2" v-model="company.descn" placeholder="请输入公司简介"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="legend-title">财务信息</p>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="纳税人识别号" prop="nsrsbh">
                <el-input v-model="company.nsrsbh" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
              <el-form-item label="发票抬头" prop="invoiceTitle">
                <el-input v-model="company.invoiceTitle" placeholder="请输入发票抬头"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="legend-title">服务支持设置</p>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="服务热线" prop="serviceTel">
                <el-input v-model="company.serviceTel" placeholder="请输入服务热线"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { SCM_API_BASE, TOKEN_KEY, SAVE_SUCCESS, SUCCESS_TIP_TITLE, BASE64_IMG_PREFIX } from '@/utils/constant'
import { getCompany, editCompany } from '@/api/bas/company'
import { validatePostcode, validateEmail, validateMobile, validateQQ, validateTel, validateURL } from '@/utils/validate'

export default {
  data() {
    const checkPostcode = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validatePostcode(value)) {
          return callback(new Error('邮政编码格式不正确'))
        }
      }
      callback()
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
    const checkURL = (rule, value, callback) => {
      if (value !== undefined && value !== '') {
        if (!validateURL(value)) {
          return callback(new Error('网址格式不正确'))
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
      companyAvatarAction: SCM_API_BASE + '/sys/attachs/companyAvatar',
      companyAvatarHeader: {
        'X-Auth-Token': sessionStorage.getItem(TOKEN_KEY)
      },
      avatar: '',
      industryCategorys: this.$store.state.code.sysCode.industry_category === undefined ? [] : this.$store.state.code.sysCode.industry_category,
      areas: this.$store.state.code.sysCode.area === undefined ? [] : this.$store.state.code.sysCode.area,
      company: {},
      companyRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 30, message: '最大长度30个字符', trigger: 'blur' }
        ],
        industryCategory: [
          { required: true, message: '行业类别不能为空', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '区域不能为空', trigger: 'blur' }
        ],
        postcode: [
          { trigger: 'blur', validator: checkPostcode }
        ],
        linkmanName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' },
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        linkmanPosition: [
          { max: 45, message: '最大长度45个字符', trigger: 'blur' }
        ],
        linkmanMobile: [
          { required: true, trigger: 'blur', validator: checkMobile }
        ],
        linkmanQq: [
          { trigger: 'blur', validator: checkQQ }
        ],
        linkmanEmail: [
          { trigger: 'blur', validator: checkEmail }
        ],
        address: [
          { max: 45, message: '最大长度255个字符', trigger: 'blur' }
        ],
        tel: [
          { trigger: 'blur', validator: checkTel }
        ],
        fax: [
          { trigger: 'blur', validator: checkTel }
        ],
        webSite: [
          { trigger: 'blur', validator: checkURL }
        ],
        nsrsbh: [
          { max: 20, message: '最大长度20个字符', trigger: 'blur' }
        ],
        invoiceTitle: [
          { max: 30, message: '最大长度30个字符', trigger: 'blur' }
        ],
        serviceTel: [
          { required: true, message: '服务热线不能为空', trigger: 'blur' },
          { max: 20, message: '最大长度20个字符' }
        ]
      }
    }
  },
  methods: {
    getCompany: function(id) {
      getCompany(id).then(res => {
        this.company = res.data
        this.company.industryCategory = this.company.industryCategory === 0 ? [] : [this.company.industryCategory]
        this.company.area = this.company.area === 0 ? [] : this.$store.state.code.sysPathCode[this.company.area].path
        this.avatar = this.company.avatar === '' ? '' : BASE64_IMG_PREFIX + this.company.avatar
      })
    },
    save: function() {
      this.$refs.companyForm.validate(valid => {
        if (valid) {
          editCompany(this.company).then(res => {
            this.$notify({
              title: SUCCESS_TIP_TITLE,
              message: SAVE_SUCCESS,
              type: 'success'
            })
          })
        }
      })
    },
    handleAvatarSuccess: function(res, file) {
      this.avatar = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload: function(file) {
      let vaild = true
      const isLt60K = file.size / 1024 <= 60
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpn' && file.type !== 'image/png' && file.type !== 'image/svg') {
        this.$message.error('上传头像图片只能是 JPG|JPEG|PNG|SVG 格式!')
        vaild = false
      }
      if (!isLt60K) {
        this.$message.error('上传头像图片大小不能超过60K!')
        vaild = false
      }
      return vaild
    }
  },
  mounted() {
    this.getCompany(this.$store.state.user.appid)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .legend-title {
    color: #03b8cc;
    font-weight: 500;
    margin-bottom: 30px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>

