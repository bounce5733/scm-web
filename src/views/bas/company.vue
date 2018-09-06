<template>
  <div class="app-container">
    <el-card>
      <div>
        <el-form :model="company" label-width="80px">
          <p class="legend-title">基础信息</p>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="公司名称">
                <el-input v-model="company.name"></el-input>
              </el-form-item>
              <el-form-item label="行业类别">
                <el-cascader
                  expand-trigger="hover"
                  :options="industryCategorys"
                  clearable
                  :props="selProps"
                  v-model="company.industryCategory"
                  change-on-select>
                </el-cascader>
              </el-form-item>
              <el-form-item label="区域">
                <el-cascader
                  expand-trigger="hover"
                  :options="areas"
                  clearable
                  :props="selProps"
                  v-model="company.area"
                  change-on-select>
                </el-cascader>
              </el-form-item>
              <el-form-item label="邮编">
                <el-input v-model="company.email" placeholder="请输入邮编"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人">
                    <el-input v-model="company.linkman" placeholder="请输入联系人名字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职位">
                    <el-input v-model="company.position" placeholder="请输入联系人职位名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="手机">
                    <el-input v-model="company.mobile" placeholder="请输入联系人手机号码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="QQ">
                    <el-input v-model="company.qq" placeholder="请输入联系人QQ号码"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="邮箱">
                <el-input v-model="company.linkmanEmail" placeholder="请输入联系人邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司logo">
                <el-upload list-type="picture-card">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="company.address" placeholder="请输入公司详细地址"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="电话">
                    <el-input v-model="company.tel" placeholder="请输入公司电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="传真">
                    <el-input v-model="company.fax" placeholder="请输入公司传真"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="公司网址">
                <el-input v-model="company.webSite" placeholder="请输入公司网址"></el-input>
              </el-form-item>
              <el-form-item label="公司介绍">
                <el-input type="textarea" :rows="2" v-model="company.descn" placeholder="请输入公司简介"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="legend-title">财务信息</p>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="纳税人识别号">
                <el-input v-model="company.nsrsbh" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
              <el-form-item label="发票抬头">
                <el-input v-model="company.invoiceTitle" placeholder="请输入发票抬头"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="legend-title">服务支持设置</p>
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="服务热线">
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

export default {
  data() {
    return {
      selProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      industryCategorys: this.$store.state.code.codes.industry_category,
      areas: this.$store.state.code.codes.area,
      company: {
      }
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .legend-title {
    color: #03b8cc;
    font-weight: 500;
    margin-bottom: 30px;
  }
</style>

