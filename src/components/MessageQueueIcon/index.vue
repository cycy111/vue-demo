<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="80%"
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    @opened="dialogOpenedFunc"
    @closed="dialogClosedFunc"
    class="message-dialog pub_dialog"
  >
    <div class="dialog-body" :style="{ maxHeight: '91%' }">
      <MessageQueue ref="messageQueueRef"></MessageQueue>
    </div>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button v-if="dialog.title=='新增用户'" @click="resetForm('addFormRef')">重置</el-button> -->
      <el-button @click="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click="subAddForm()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MessageQueue from '@/views/WoMallManagement/MessageQueue';
export default {
  data() {
    return {
      dialog: {
        title: '消息队列查询',
        visible: false
      }
    };
  },
  components: {
    MessageQueue
  },
  methods: {
    dialogClosedFunc() {},
    dialogOpenedFunc() {
      setTimeout(() => {
        this.$refs['messageQueueRef'].refresh();
      }, 50);
    },
    show() {
      this.dialog.visible = true;
    }
  }
};
</script>

<style lang="stylus">
.message-dialog{
    .el-dialog{
        .el-dialog__body{
            padding:0;
        }
    }
}
.el-dialog{
  .dialog-body{
    overflow-y:auto;
  }
}
.pub_dialog {
    display: flex;
    justify-content: center;
    align-items: Center;
    overflow: hidden;
    .el-dialog {
        margin: 0 auto !important;
        height: 90%;
        overflow: hidden;
        .el-dialog__body {
            position: absolute;
            left: 0;
            top: 54px;
            bottom: 0;
            right: 0;
            padding: 0;
            z-index: 1;
            overflow: hidden;
            overflow-y: auto;
        }
        .el-dialog__footer{
          position: absolute;
          padding: 0px;
          text-align: right;
          box-sizing: border-box;
          bottom: 10px;
          right: 20px;
          z-index: 2;
          width: 100%;
          background: #fff;
        }
    }
}
</style>
