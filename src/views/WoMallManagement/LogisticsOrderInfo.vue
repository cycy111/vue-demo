<template>
  <div class="app-container">
    <el-container>
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="default"
            size="small"
            @click="handleBackBtnClickFunc()"
            ><i class="iconfont el-icon-back"></i>返回</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handleUpdateBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i
            >推送更新物流单信息</el-button
          >
        </el-form-item>
        <el-form-item v-show="infos.operateState == 1">
          <el-button
            type="primary"
            size="small"
            @click="handleConfirmBtnClickFunc()"
            ><i class="iconfont el-icon-circle-check"></i>确认接收</el-button
          >
        </el-form-item>
        <el-form-item v-show="infos.operateState == 1">
          <el-button
            type="danger"
            size="small"
            @click="handleRejectBtnClickFunc()"
            ><i class="iconfont el-icon-circle-close"></i>拒绝接收</el-button
          >
        </el-form-item>
      </el-form>
    </el-container>
    <div class="infos">
      <div class="infos-item" v-for="(item, index) in column" :key="index">
        <div class="m-label">{{ item.label + '：' }}</div>
        <div class="m-text">{{ infos[item.name] }}</div>
      </div>
    </div>
    <el-tabs
      class="my-tabs"
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="item.label"
        :name="item.value"
        v-for="(item, index) in panes"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import md5 from 'md5';
import { Message } from 'element-ui';
import { validateLoginName, validateMoblePhone } from '@/utils/validate';
import messages from '@/utils/messages';
import { tirmFilter } from '@/utils/tools';
import '@/directives/dialogCtrl.js';
import { tableToExcel } from '@/utils/cmn';
import {
  getLogisticsOrder,
  addQueueList
} from '@/api/WoMallManagement/logistics-order-list';
const _ = require('lodash');
import { getAreaList } from '@/api/WoMallManagement/address';
export default {
  data() {
    return {
      activeName: 'relateUserInfo',
      panes: [
        { label: '下单、寄件、收件人', value: 'relateUserInfo' },
        { label: '商品信息', value: 'goodInfo' },
        { label: '商城推送', value: 'mallPushInfo' },
        { label: '取件信息', value: 'takeCargoInfo' },
        { label: '电子合同信息', value: 'electronicContract' },
        { label: '追加费用信息', value: 'additionFee' },
        { label: '妥投/拒收信息', value: 'deliverRejection' },
        { label: '取消结果确认', value: 'cancelConfirm' },
        { label: '确认发货信息', value: 'shipmentConfirm' },
        { label: '物流追踪信息', value: 'logisticsTracking' }
      ],
      column: [
        { name: 'orderNO', label: '物流订单号', isFixed: true },
        { name: 'contactNo', label: '协议/电子合同编号' },
        { name: 'signou', label: '协议签署单位（省）' },
        { name: 'expressTypeDesc', label: '运输类型' },
        { name: 'weights', label: '重量(kg)' },
        { name: 'expectedTime', label: '预约上门取件时间' },
        { name: 'isLoadDesc', label: '是否装卸' },
        { name: 'isStockDesc', label: '是否送仓' },
        { name: 'isProtectDesc', label: '是否装卸' },
        { name: 'declareValue', label: '货物声明价值' },
        { name: 'protectedTaxRate', label: '价保费率' },
        { name: 'loadTaxPrice', label: '装卸费  （含税）' },
        { name: 'stockTaxPrice', label: '送仓费（含税）' },
        { name: 'protectTaxPrice', label: '价保费（含税）' },
        { name: 'addedPrice', label: '追加费用（含税）' },
        { name: 'realPrice', label: '运输价格（含税）' },
        { name: 'realTotalPrice', label: '运输总价格（含税）' },
        { name: 'ordTypeDesc', label: '物流单状态' },
        { name: 'freezeStateDesc', label: '冻结状态' },
        { name: 'reason', label: '取消原因' },
        { name: 'operateStateDesc', label: '订单操作状态' },
        { name: 'remark', label: '备注' },
        { name: 'addDate', label: '创建时间' },
        { name: 'editDate', label: '修改时间' },
        { name: 'operatorId', label: '操作人' }
      ],
      orderNO: '',
      infos: ''
    };
  },

  methods: {
    handleClick(tab, event) {
      this.$router.replace({
        name: tab.name,
        param: { orderNO: this.orderNO }
      });
    },
    getLogisticsInfo() {
      let orderNO = this.orderNO || -1;
      let data = _.assign({ pageIndex: 1, pageSize: 1 }, { orderNO: orderNO });
      getLogisticsOrder(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let data = res.data.data;
            if (data && data.length) {
              this.infos = data[0];
            }
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
    },
    handleBackBtnClickFunc() {
      this.$router.push({ name: 'LogisticsOrderList' });
    },
    handleUpdateBtnClickFunc() {
      let data = {
        interfaceId: '2.7',
        interfaceName: '物流订单查询接口',
        paramId: this.orderNO
      };
      this.pushMsg(data);
    },
    pushMsg(data) {
      addQueueList(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            return Message({
              message: '操作成功，请稍后在消息推送列表中查看结果',
              type: 'success',
              duration: 3 * 1000
            });
          } else {
            return Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
          }
        })
        .catch(err => {
          return Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
    },
    handleConfirmBtnClickFunc() {
      let data = {
        interfaceId: '2.8',
        interfaceName: '物流订单接收确认接口',
        paramId: this.orderNO,
        paramExt: '{"state":"0"}'
      };
      this.pushMsg(data);
    },
    handleRejectBtnClickFunc() {
      this.$prompt('请输入取消原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '请输入取消原因'
      })
        .then(({ value }) => {
          let data = {
            interfaceId: '2.8',
            interfaceName: '物流订单接收确认接口',
            paramId: this.orderNO,
            paramExt: `{"state":"1","receiveFailReason":"${value}"}`
          };
          this.pushMsg(data);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    }
  },
  activated() {
    this.orderNO = this.$route.params.orderNO;
    let arr = _.filter(this.panes, c => {
      return this.$route.path.includes(c.value);
    });
    if (arr && arr.length) {
      this.activeName = arr[0].value;
    }
    this.getLogisticsInfo();
    console.log('logistics info activeted');
    // this.$router.replace({
    //   name: this.activeName,
    //   param: { orderNO: this.orderNO }
    // });
  },
  mounted() {
    this.orderNO = this.$route.params.orderNO;
    let arr = _.filter(this.panes, c => {
      return this.$route.path.includes(c.value);
    });
    if (arr && arr.length) {
      this.activeName = arr[0].value;
    }
    this.getLogisticsInfo();
    // this.$router.push({
    //   name: this.activeName,
    //   param: { orderNO: this.orderNO }
    // });
  },
  beforeRouteUpdate(to, from, next) {
    // if (to.name === 'LogisticsOrderInfo') {
    //   this.orderNO = to.query.orderNO;
    //   this.getLogisticsInfo();
    //   // this.$router.push({
    //   //   name: this.activeName,
    //   //   param: { orderNO: this.orderNO }
    //   // });
    // }
    next();
  },
  beforeRouteLeave(to, from, next) {
    from.meta.keepAlive = false;
    if (to.name === 'LogisticsOrderList') {
      to.meta.keepAlive = true;
      console.log('logis keepalive true');
    }
    next();
  }
};
</script>

<style lang="stylus">
.my-tabs{
  margin-top:20px;
}
.infos{
    margin-bottom:20px;
  font-size:14px;
  font-weight:500;
  line-height:30px;
  display:flex;
  flex-direction:row;
  flex-wrap: wrap;
  .infos-item{
    width:24%;
    padding:0px 5px;
    direction:row;
    align-items:baseline;
    display:block;
    justify-content:space-between;
    .m-label{
      color:#333
      display: inline-block;
    }
    .m-text{
      display: inline;
      padding-left:0;
      color:#666;
    }
  }
}
</style>
