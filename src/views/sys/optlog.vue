<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="optType" @keyup.native.enter="queryByPage" placeholder="请输入操作类型关键字" style="width: 530px;">
            <el-select slot="prepend" @change="dateChange" style="width: 110px;" v-model="dateRange">
              <el-option
                v-for="item in dateRangeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span slot="prepend">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-select slot="prepend" @change="operatorChange" style="width: 80px;" v-model="operator">
              <el-option
                v-for="item in operatorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button slot="append" @click="queryByPage" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="logs" @sort-change="sortData" border style="width: 100%;">
      <el-table-column prop="userName" label="操作人" width="100" sortable></el-table-column>
      <el-table-column prop="createdTime" label="时间" width="160" sortable></el-table-column>
      <el-table-column prop="optType" label="操作类型" width="120" sortable></el-table-column>
      <el-table-column prop="optLog" label="操作日志" sortable></el-table-column>
    </el-table>
    <el-pagination layout="prev, pager, next" @current-change="pageChange" :current-page="params.pageNum" :page-size="params.pageSize" :total="total" style="float:right;">
    </el-pagination>
 </div>
</template>

<script>
import { queryOptlogByPage } from '@/api/sys/optlog'
import { parseTime } from '@/utils/index'
export default {

  data() {
    return {
      total: 0,
      params: {
        order: 'desc',
        orderField: 'createdTime',
        pageNum: 1,
        pageSize: 10
      },
      optType: '',
      dateRangeOptions: [{
        value: 'oneDay',
        label: '最近一天'
      }, {
        value: 'oneWeek',
        label: '最近一周'
      }, {
        value: 'oneMonth',
        label: '最近一月'
      }, {
        value: 'threeMonth',
        label: '最近三月'
      }],
      dateRange: 'oneMonth',
      operatorOptions: [{
        value: 'all',
        label: '全部'
      }, {
        value: 'me',
        label: '本人'
      }],
      operator: 'me',
      logs: []
    }
  },
  methods: {
    queryByPage: function() {
      const endTime = new Date()
      let startTime = ''
      switch (this.dateRange) {
        case 'oneMonth':
          startTime = new Date().setTime(endTime.getTime() - 3600 * 1000 * 24 * 30)
          break
        case 'oneDay':
          startTime = new Date().setTime(endTime.getTime() - 3600 * 1000 * 24)
          break
        case 'oneWeek':
          startTime = new Date().setTime(endTime.getTime() - 3600 * 1000 * 24 * 7)
          break
        case 'threeMonth':
          startTime = new Date().setTime(endTime.getTime() - 3600 * 1000 * 24 * 90)
          break
      }
      let isme = true
      if (this.operator === 'all') {
        isme = false
      }
      queryOptlogByPage(this.optType, isme, parseTime(startTime), parseTime(endTime), this.params).then(res => {
        this.logs = res.data.list
        this.total = res.data.total
      })
    },
    operatorChange: function() {
      this.params.pageNum = 1
      this.queryByPage()
    },
    dateChange: function() {
      this.params.pageNum = 1
      this.queryByPage()
    },
    pageChange: function(val) {
      this.params.pageNum = val
      this.queryByPage()
    },
    sortData: function(sortobj) {
      this.params.order = sortobj.order === null ? '' : sortobj.order === 'ascending' ? 'asc' : 'desc'
      this.queryByPage()
    }
  },
  mounted() {
    this.queryByPage()
  }
}
</script>