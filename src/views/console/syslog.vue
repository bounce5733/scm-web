<template>
  <div class="app-container">
    <el-row>
      <el-form @submit.native.prevent>
        <el-col :span="4" :offset="20">
          <el-form-item>
            <el-button type="primary" :disabled="isOpen" size="small" @click="refresh">打开日志</el-button>
            <el-button type="primary" :disabled="!isOpen" size="small" @click="close">关闭日志</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-input type="textarea" :rows="20" readonly placeholder="系统日志" v-model="syslog">
      </el-input>
    </el-row>
  </div>
</template>

<script>
import { SCM_WS_BASE } from '@/utils/constant'

export default {
  data() {
    return {
      isOpen: this.$store.state.app.websocket && this.$store.state.app.websocket.readyState === 1,
      syslog: this.$store.state.app.syslog
    }
  },
  methods: {
    refresh: function() {
      const that = this
      // 判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        const websocket = new WebSocket(SCM_WS_BASE + '/syslog')

        // 连接发生错误的回调方法
        websocket.onerror = function() {
          console.log('websocket error')
        }

        // 连接成功建立的回调方法
        websocket.onopen = function(event) {
          console.log('websocket open')
        }

        // 接收到消息的回调方法
        websocket.onmessage = function(event) {
          that.$store.commit('APPEND_LOG', event.data)
          that.syslog += event.data
        }

        // 连接关闭的回调方法
        websocket.onclose = function() {
          console.log('websocket close')
        }

        that.$store.commit('SET_WEBSOCKET', websocket)
        that.isOpen = true
      } else {
        console.log('bowser is not support websocket')
      }
    },
    close: function() {
      if (this.$store.state.app.websocket && this.$store.state.app.websocket.readyState === 1) {
        this.$store.state.app.websocket.close()
        this.$store.commit('CLEAR_LOG')
        this.isOpen = false
        this.syslog = ''
      }
    }
  },
  mounted() {
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
      this.$store.state.app.websocket.close()
      this.$store.commit('CLEAR_LOG')
    }
  }
}
</script>