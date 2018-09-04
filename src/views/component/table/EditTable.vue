<template>
  <div class="dashboard-editor-container">
    <el-card style="width:100%">
      <div slot="header" class="clearfix">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item label="供应商">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="单据日期">
            <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="交货日期">
            <el-date-picker type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-radio-group>
              <el-radio label="购货"></el-radio>
              <el-radio label="退货"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="text-align:right">
            <el-button type="primary">保存并新增</el-button>
            <el-button type="primary">保存</el-button>
            <el-button type="primary" @click="send">发送websocket消息</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table :data="tableData" border @row-dblclick="editRow" @header-click="cancelEdit" style="width: 100%">
          <el-table-column prop="date" label="日期" width="280">
            <template slot-scope="scope">
              <span v-if="!scope.row.editFlag">{{scope.row.date}}</span>
              <el-date-picker v-else @change="formatDate(scope.row)" v-model="scope.row.date" type="date" placeholder="选择日期"></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180">
            <template slot-scope="scope">
              <span v-if="!scope.row.editFlag">{{scope.row.name}}</span>
              <el-input v-else v-model="scope.row.name" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="地址">
            <template slot-scope="scope">
              <span v-if="!scope.row.editFlag">{{scope.row.address}}</span>
              <el-input v-else v-model="scope.row.address" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { parseDate } from '@/utils'
export default {
  data() {
    return {
      websocket: null,
      orderDate: '2018-07-29',
      tableData: [
        {
          id: '1',
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          editFlag: false
        },
        {
          id: '2',
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          editFlag: false
        },
        {
          id: '3',
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          editFlag: false
        },
        {
          id: '4',
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          editFlag: false
        }
      ]
    }
  },
  methods: {
    editRow: function(row, event) {
      row.editFlag = true
      this.tableData.forEach(item => {
        if (item.id !== row.id) {
          item.editFlag = false
        }
      })
    },
    cancelEdit: function() {
      this.tableData.forEach(item => {
        item.editFlag = false
      })
    },
    formatDate: function(row) {
      row.date = row.date === null ? '' : parseDate(row.date)
    },
    send: function() {
      const msg = 'hello websocket'
      this.websocket.send(msg)
    },
    closeWebSocket: function() {
      this.websocket.close()
    }
  },
  mounted() {
    // 判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
      this.websocket = new WebSocket('ws://localhost:9111/websocket')
    } else {
      console.log('not support websocket')
    }

    // 连接发生错误的回调方法
    this.websocket.onerror = function() {
      console.log('error')
    }

    // 连接成功建立的回调方法
    this.websocket.onopen = function(event) {
      console.log('open')
    }

    // 接收到消息的回调方法
    this.websocket.onmessage = function(event) {
      console.log(event.data)
    }

    // 连接关闭的回调方法
    this.websocket.onclose = function() {
      console.log('close')
    }

    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
      this.websocket.close()
    }
  },
  beforeDestroy() {
    this.closeWebSocket()
  }
}
</script>

  <style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 12px;
}

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
  clear: both;
}
</style>