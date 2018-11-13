<template>
  <div class="app-container">
    <el-row>
      <el-form @submit.native.prevent>
        <el-col :span="2" :offset="22">
          <el-form-item>
            <el-button type="primary" size="small" @click="refresh">打开日志</el-button>
            <el-button type="primary" size="small" @click="close">关闭日志</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-input
        type="textarea"
        :rows="20"
        placeholder="系统日志"
        v-model="syslog">
      </el-input>
    </el-row>
  </div>
</template>

<script>
import { SCM_WS_BASE } from '@/utils/constant'

export default {
  data() {
    return {
      websocket: null,
      syslog: ''
    }
  },
  methods: {
    refresh: function() {
      // 判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        this.websocket = new WebSocket(SCM_WS_BASE + '/syslog')

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
          this.syslog = this.syslog + event.data
        }

        // 连接关闭的回调方法
        this.websocket.onclose = function() {
          console.log('close')
        }
      } else {
        console.log('not support websocket')
      }
    },
    close: function() {
      this.websocket.close()
    }
  },
  mounted() {

    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
      this.websocket.close()
    }
  }
}
</script>