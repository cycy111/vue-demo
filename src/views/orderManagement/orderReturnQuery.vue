<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form :inline="true" ref="form" :model="searchForm">
        <el-form-item label="">
          <el-input
            placeholder="请输入订单号"
            size="small"
            v-model="searchForm.orderNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            placeholder="请输入客户订单号"
            size="small"
            v-model="searchForm.ordClientNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="searchForm.ordWorkflow"
            clearable
            placeholder="请选择订单状态"
            size="small"
          >
            <el-option
              v-for="item in ordWorkflows"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="searchForm.searchDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
            :picker-options="$util.pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="searchFormMethod(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      border
      :data="tables.orderList"
      tooltip-effect="dark"
      :max-height="tables.tableMaxHeight"
      size="mini"
      row-key="IDX"
      @row-dblclick="rowDblclick"
    >
      <el-table-column label="订单号" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.ordNo }}</template>
      </el-table-column>
      <el-table-column
        prop="ordClientNo"
        label="客户订单号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="noticeDate"
        label="下单时间"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="ORD_WORKFLOW" label="订单状态" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="ordWorkflow"
        label="订单状态"
        show-overflow-tooltip
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ordWorkflow === '已出库'">在途</span>
          <span v-else-if="scope.row.ordWorkflow === '已交付'">已交付</span>
          <span v-else>已回单</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ordFromName"
        label="发货方名称"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="ORD_FROM_CTEL" label="起运点联系人" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="ordFromAddress"
        label="起运点地址"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="ORD_TO_NAME" label="收货方名称" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="ordToCName"
        label="收货人姓名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="ordToCtel"
        label="收货人电话"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="ORD_TO_CTEL" label="到达点联系人" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="ordToAddress"
        label="到达点地址"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="isRecept" label="是否有附件" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isRecept === '是'" style="color:#67C23A;"
            >是</span
          >
          <span v-else>{{ scope.row.isRecept }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="ORD_TO_NAME" label="目的点名称" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="ORD_TO_ADDRESS" label="目的点地址" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="orderDetails" label="订单细节" width="90">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            size="mini"
            @click="orderDetails(scope.row)"
            icon="el-icon-tickets"
            type="primary"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="回单附件信息" width="120">
        <template slot-scope="props">
          <el-button
            slot="reference"
            size="mini"
            @click="_getOrderFile(props.row)"
            icon="el-icon-view"
            type="primary"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        small
        @current-change="currentPageChange"
        :current-page="tables.postParams.currentPage"
        :page-sizes="tables.pageSizes"
        :page-size="tables.postParams.pageSize"
        layout="total,prev, pager, next"
        :total="tables.postParams.total"
        v-if="tables.postParams.total"
      ></el-pagination>
    </div>
    <el-dialog
      title="回单附件信息"
      :visible.sync="tables.dialogVisible"
      :close-on-click-modal="false"
    >
      <el-table
        :data="tables.orderFileList.data"
        border
        size="mini"
        max-height="350"
      >
        <el-table-column prop="REMARK" label="附件说明" width="180">
        </el-table-column>
        <el-table-column prop="DATE" label="上传日期" width="180">
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="rows">
            <el-button
              @click.native.prevent="download(rows)"
              type="text"
              size="small"
            >
              下载</el-button
            >
            <el-button
              @click.native.prevent="viewImage(rows)"
              type="text"
              size="small"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="订单细节"
      :visible.sync="tables.dialogVisibleDetails"
      width="70%"
      v-dialogDrag
      v-dialogDragWidth
      ref="dialog__wrapper"
      :close-on-click-modal="false"
    >
      <el-table :data="tables.orderDetailParams.data" border size="mini">
        <el-table-column type="expand">
          <template slot-scope="rows">
            <el-form label-position="left" inline class="table-expand-form">
              <el-form-item label="订单体积"
                ><span>{{
                  rows.row.ORDER_VOLUME ? rows.row.ORDER_VOLUME : 0
                }}</span></el-form-item
              >
              <el-form-item label="体积单位"
                ><span>{{
                  rows.row.name ? rows.row.name : 0
                }}</span></el-form-item
              >
              <el-form-item label="单价"
                ><span>{{
                  rows.row.PRODUCT_PRICE ? rows.row.PRODUCT_PRICE : 0
                }}</span></el-form-item
              >
              <el-form-item label="货物状态"
                ><span>{{
                  rows.row.PRODUCT_STATE ? rows.row.PRODUCT_STATE : 0
                }}</span></el-form-item
              >
              <el-form-item label="订单备注"
                ><span>{{
                  rows.row.REMARK_SUPPLIER ? rows.row.REMARK_SUPPLIER : 0
                }}</span></el-form-item
              >
              <el-form-item label="产品条码"
                ><span>{{
                  rows.row.PRODUCT_BARCODE ? rows.row.PRODUCT_BARCODE : 0
                }}</span></el-form-item
              >
              <el-form-item label="包装说明"
                ><span>{{
                  rows.row.REMARK_REPACK ? rows.row.REMARK_REPACK : 0
                }}</span></el-form-item
              >
              <el-form-item label="审核备注"
                ><span>{{
                  rows.row.REMARK_AUDIT ? rows.row.REMARK_AUDIT : 0
                }}</span></el-form-item
              >
              <el-form-item label="重量单位"
                ><span>{{
                  rows.row.UOM_NAME ? rows.row.UOM_NAME : 0
                }}</span></el-form-item
              >
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="PRODUCT_NO"
          label="产品代码"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="PRODUCT_NAME"
          label="产品名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="PRODUCT_DESC"
          label="产品说明"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="LINE_NO"
          label="行号"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="LINE_NO_CLIENT"
          label="客户行号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="PO_QTY"
          label="PO数量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="PO_UOM"
          label="PO单位"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="PO_WEIGHT"
          label="PO重量"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="PO_VOLUME"
          label="PO体积"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ORDER_QTY"
          label="订单数量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ORDER_UOM"
          label="订单单位"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="LEVEL_QTY"
          label="二级数量"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="LEVEL_UOM"
          label="二级单位"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="LEVEL_TITEL"
          label="二级显示"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ORDER_WEIGHT"
          label="订单重量"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          v-if="tables.orderDetailParams.total"
          background
          small
          @current-change="orderDetallCurrentPage"
          :current-page="tables.orderDetailParams.pageIndex"
          :page-sizes="tables.pageSizes"
          :page-size="tables.orderDetailParams.pageSize"
          layout="total,prev, pager, next"
          :total="tables.orderDetailParams.total"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui';
import {
  getReturnOrders,
  getOrderFile,
  getOrderProduct,
  orderDetall
} from '@/api/order';
import { pickerOptions } from '@/utils/index';
import { servers } from '@/utils/servers.js';
import * as screenfull from 'screenfull';
import '@/styles/custom.scss';
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      tableNew: {
        isShow: false,
        data: []
      },
      tables: {
        orderList: [],
        tableMaxHeight: document.body.clientHeight - 230,
        dialogVisible: false,
        dialogVisibleDetails: false,
        pageSizes: [10, 20, 30, 40],
        rows: null,
        orderFileList: {
          data: [], //返回数据容器
          Id: 1937649,
          pageSize: 5,
          pageIndex: 1,
          total: null
        },
        orderDetailParams: {
          data: [],
          idx: '',
          keyValue: 'orderlistDetall',
          pageSize: 10,
          pageIndex: 1,
          total: 0
        },
        postParams: {
          currentPage: 1,
          pageSize: 50,
          total: 0,
          orderDirection: '',
          orderProp: ''
        }
      },
      searchForm: {
        ordNo: '',
        ordClientNo: '',
        ordWorkflow: '',
        searchDate: []
      },
      activeName: 'first',
      multipleSelection: [],
      ordWorkflows: [
        //   {
        //     value: "已出库",
        //     label: "在途"
        //   },
        {
          value: '已交付',
          text: '已交付'
        },
        {
          value: '已回单',
          text: '已回单'
        }
      ]
    };
  },
  methods: {
    viewImage(rows) {
      window.open(servers.imgagesServer + rows.row.PATH);
    },
    download(rows) {
      var $a = document.createElement('a');
      $a.setAttribute('href', servers.imgagesServer + rows.row.PATH);
      $a.setAttribute('download', rows.row.NAME);
      var evObj = document.createEvent('MouseEvents');
      evObj.initMouseEvent(
        'click',
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        true,
        false,
        0,
        null
      );
      $a.dispatchEvent(evObj);
    },

    orderDetallCurrentPage(currentPageNum) {
      this.tables.orderDetailParams.pageIndex = currentPageNum;
      this.orderDetails(this.tables.rows);
    },
    orderDetails(row) {
      //console.log(row);
      this.tables.dialogVisibleDetails = true;
      this.tables.rows = row;
      this.tables.orderDetailParams.data = [];
      this.tables.orderDetailParams.idx = row.ordIdx;
      orderDetall(this.tables.orderDetailParams).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data;
          let OrderListDetall = data.data.OrderListDetall;
          this.tables.orderDetailParams.data = OrderListDetall;
          this.tables.orderDetailParams.total = data.counts;
        }
      });
    },
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      this._getReturnOrders();
    },
    rowDblclick(row, column) {
      // let rowEl = column.path.filter((v, i) => {
      //   if (v.className === "el-table__row") return v;
      // })[0];
      // let cols = rowEl.children.length;
      // if (
      //   rowEl.nextElementSibling === null ||
      //   rowEl.nextElementSibling.className.indexOf("insert-table") === -1
      // ) {
      //   getOrderProduct({
      //     id: row.IDX
      //   }).then(res => {
      //     if (res.data && res.data.resultCode === 1) {
      //       this.tableNew.data = res.data.data;
      //       let tableHtml = "";
      //       this.tableNew.data.forEach((v, i) => {
      //         tableHtml += `<tr><td>${v.ROW_NUMBER}</td><td>${v.PRODUCT_NO}</td><td>${v.PRODUCT_NAME}</td><td>${v.ORDER_UOM}</td><td>${v.ORDER_QTY}</td><td>${v.ORDER_VOLUME}</td><td>${v.ORDER_WEIGHT}</td></tr>`;
      //       });
      //       let inserTable = `<tr class="insert-table animated fadeIn"><td colspan='${cols}'>
      // 						<table cellspacing="0" cellpadding="0" border="0" class="el-child-table" style="width: 100%;">
      // 							<thead><tr><th>序号</th><th>产品代码</th><th>产品名称</th><th>单位</th><th>数量</th><th>体积(方)</th><th>重量(吨)</th></tr></thead>
      // 							<tbody>${tableHtml}</tbody>
      // 						</table>
      // </td></tr>`;
      //       rowEl.insertAdjacentHTML("afterEnd", inserTable);
      //       rowEl.style.background = "#ECF5FF";
      //     } else {
      //       Message({
      //         message: "该项记录未发现货运单数据！",
      //         type: "error",
      //         duration: 3 * 1000
      //       });
      //     }
      //   });
      // } else {
      //   rowEl.removeAttribute("style");
      //   rowEl.nextElementSibling.className = "insert-table animated fadeOut";
      //   setTimeout(() => {
      //     rowEl.nextElementSibling.parentNode.removeChild(
      //       rowEl.nextElementSibling
      //     );
      //     this.$refs.multipleTable.doLayout();
      //   }, 300);
      // }
    },
    _getReturnOrders() {
      let data = {
        deptCode: this.searchForm.deptCode,
        docEntry: this.searchForm.docEntry,
        productCode: this.searchForm.productCode,
        productName: this.searchForm.productName,
        ordNo: this.searchForm.ordNo,
        ordClientNo: this.searchForm.ordClientNo,
        ordWorkflow: this.searchForm.ordWorkflow,
        beginDate:
          this.searchForm.searchDate && this.searchForm.searchDate.length
            ? this.searchForm.searchDate[0]
            : '',
        endDate:
          this.searchForm.searchDate && this.searchForm.searchDate.length
            ? this.searchForm.searchDate[1]
            : '',
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      };
      getReturnOrders(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let data = res.data;
            this.tables.orderList = data.data;
            if (res.data.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
            }
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    _getOrderFile(row, expandedRows) {
      this.tables.dialogVisible = true;
      //修改请求参数
      let data = {
        ordIdx: row.ordIdx
      };
      getOrderFile(data)
        .then(res => {
          let data = res.data;
          this.tables.orderFileList.data = data.data;
        })
        .catch(err => {});
    },
    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    }
  },
  mounted() {
    //this.searchFormMethod(1);
  }
};
</script>
<style></style>
