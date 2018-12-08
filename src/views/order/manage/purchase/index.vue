<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-select  placeholder="全部订单" v-model="orderType">
            <el-option
              v-for="item in sysCode.order_type"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="value5"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input v-model="orderQueryParam" placeholder="请输入订单号/客户名称" style="width: 330px;">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          &nbsp;&nbsp;高级搜索
        </el-form-item>
      </el-form>

      <!--列表-->
      <el-table :data="orders" highlight-current-row border style="width: 100%;">
        <el-table-column prop="name" label="订单号"></el-table-column>
        <el-table-column prop="descn" label="下单时间" sortable></el-table-column>
        <el-table-column prop="descn" label="客户名称" sortable></el-table-column>
        <el-table-column prop="descn" label="客户编码"></el-table-column>
        <el-table-column prop="descn" label="金额" sortable></el-table-column>
        <el-table-column prop="descn" label="出库/发货"></el-table-column>
        <el-table-column prop="descn" label="状态" sortable></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
      orderQueryParam: '',
      orderType: '',
      orderTypes: this.$store.state.code.sysCode.order_type,
      pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        value5: '',
        orders: []
    }
  },
  computed: {
    ...mapGetters([
      'sysCode'
    ])
  },
  menthods: {
    queryByPage: function() {

    }
  },
  mounted() {
    console.log(JSON.stringify(this.$store.state.code.sysCode.order_type))
  }
}
</script>