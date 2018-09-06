<template>
  <div class="app-container">
    <el-row :gutter="32">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>常规</span>
            <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>
          </div>
          <div class="text item">
            <el-form :model="common">
              <el-form-item>
                <el-input v-model="common.systemName">
                  <template slot="prepend">系统名称</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="common.pageSize">
                  <template slot="prepend">分页大小</template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-input type="password" v-model="common.initPwd">
                  <template slot="prepend">初始密码</template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>任务</span>
            <el-button style="float: right; padding: 3px 0" type="text">保存</el-button>
          </div>
          <div class="text item">
            <el-form :model="job">
                <el-input v-model="job.logRate">
                  <template slot="prepend">日志频率</template>
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
 </div>
</template>

<script>
export default {

  data() {
    return {
      common: {
        initPwd: '000000',
        pageSize: 10,
        systemName: 'CMS'
      },
      job: {
        logRate: 2
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
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>