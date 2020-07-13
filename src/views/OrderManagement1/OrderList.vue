<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-container>
        <el-form :inline="true" ref="form" :model="form">
          <el-form-item label="">
            <el-input
              placeholder="请输入订单号"
              v-model="form.orderNumber"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="请输入客户订单号"
              v-model="form.customerOrderNumber"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="selects.default"
              clearable
              placeholder="请选择订单状态"
              size="small"
            >
              <el-option
                v-for="item in selects.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker
              v-model="form.creationTime"
              value-format="yyyy/MM/dd hh:mm:ss"
              size="small"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="出库开始日期"
              end-placeholder="出库结束日期"
              :picker-options="$util.pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrders" size="small"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
    </div>
    <el-table
      ref="multipleTable"
      border
      :data="tables.postParams.data"
      tooltip-effect="dark"
      size="mini"
      :max-height="tables.tableMaxHeight"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand-form">
            <!-- <el-form-item label="运单号"><span>{{ scope.row.TMS_SHIPMENT_NO }}</span></el-form-item> -->
            <!-- <el-form-item label="司机姓名"><span>{{ scope.row.TMS_DRIVER_NAME }}</span></el-form-item> -->
            <!-- <el-form-item label="司机电话"><span>{{ scope.row.TMS_DRIVER_TEL }}</span></el-form-item> -->
            <el-form-item label="提货地址"
              ><span>{{ scope.row.ORD_FROM_ADDRESS }}</span></el-form-item
            >
            <el-form-item label="收货地址"
              ><span>{{ scope.row.ORD_TO_ADDRESS }}</span></el-form-item
            >
            <!-- <el-form-item label="送货地址"><span>{{ scope.row.ORD_FROM_ADDRESS }}</span></el-form-item> -->
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="订单号" width="150" show-overflow-tooltip
        ><template slot-scope="scope">{{
          scope.row.ORD_NO
        }}</template></el-table-column
      >
      <el-table-column
        prop="ORD_NO_CLIENT"
        label="客户订单号"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="TMS_SHIPMENT_NO"
        label="运单号"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="TMS_DATE_ISSUE"
        label="出库时间"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="ORD_WORKFLOW" label="订单状态" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="ORD_WORKFLOW"
        label="订单状态"
        show-overflow-tooltip
        align="center"
        width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.ORD_WORKFLOW === '已出库'">在途</span>
          <span v-else-if="scope.row.ORD_WORKFLOW === '已交付'"
            ><!--<el-tag type="success">-->已交付<!--</el-tag>--></span
          >
          <span v-else>已回单</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="TMS_PLATE_NUMBER"
        label="车牌号"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="ORD_TO_CNAME"
        label="收货人姓名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="ORD_TO_CTEL"
        label="收货人电话"
        show-overflow-tooltip
      ></el-table-column>

      <!-- <el-table-column prop="OTS_DELIVERY_ACTUAL" label="预计交付时间" show-overflow-tooltip ></el-table-column> -->
      <el-table-column
        prop="OTS_DELIVERY_ACTUAL"
        label="交付确认时间"
        show-overflow-tooltip
        width="130"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.OTS_DELIVERY_ACTUAL ? scope.row.OTS_DELIVERY_ACTUAL : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="SHIPLIST"
        label="是否有轨迹"
        show-overflow-tooltip
        width="130"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.SHIPLIST === '有轨迹'" style="color:#67C23A;"
            >有轨迹</span
          >
          <span v-else>{{ scope.row.SHIPLIST }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="TMS_DRIVER_NAME" label="司机姓名" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column prop="TMS_DRIVER_TEL" label="司机电话" show-overflow-tooltip></el-table-column> -->
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
      <el-table-column prop="gj" label="轨迹列表" width="90">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            size="mini"
            @click="_orderMapList(scope.row)"
            icon="el-icon-view"
            type="primary"
            >查看</el-button
          >
        </template>
      </el-table-column>

      <!-- <el-table-column prop="map" label="地图轨迹" width="90">
				<template slot-scope="scope">
					<router-link target="_blank" tag="a" :to="{path:'/mapTrajectoryDetails',query:{OrderNo:scope.row.ORD_NO,shipmentno:scope.row.TMS_SHIPMENT_NO}}"><el-button size="mini" icon="el-icon-location" type="primary">查看</el-button></router-link>
				</template>
				</el-table-column> -->
      <el-table-column prop="map" label="地图轨迹" width="90">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            size="mini"
            @click.native.prevent="_orderMapView(scope.row)"
            icon="el-icon-location"
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
        @current-change="currentPage"
        :current-page="tables.postParams.currentPage"
        :page-sizes="tables.pageSizes"
        :page-size="tables.postParams.pageSize"
        layout="total,prev, pager, next"
        :total="tables.postParams.total"
        v-if="tables.postParams.total"
      ></el-pagination>
    </div>

    <el-dialog
      title="轨迹列表"
      :visible.sync="tables.dialogVisible"
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      ref="dialog__wrapper"
    >
      <el-table :data="tables.trajectoryParams.data" border size="mini">
        <el-table-column
          width="150"
          property="GPSTIME"
          label="时间"
        ></el-table-column>
        <el-table-column
          width="376"
          property="ADDRESS"
          label="位置"
        ></el-table-column>
        <el-table-column property="LASTMILEAGE" label="剩余公里">
          <template slot-scope="scope">
            <span>{{ scope.row.LASTMILEAGE }}</span>
            <!-- <el-button slot="reference" size="mini" @click="_orderMapList(scope.row)" icon="el-icon-view" type="primary">查看</el-button> -->
          </template>
        </el-table-column>
        <el-table-column property="LASTTIME" label="剩余时间/h">
          <template slot-scope="scope">
            <span>{{ scope.row.LASTTIME }}</span>
            <!-- <el-button slot="reference" size="mini" @click="_orderMapList(scope.row)" icon="el-icon-view" type="primary">查看</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          v-if="tables.trajectoryParams.total"
          background
          small
          @current-change="trajectoryCurrentPage"
          :current-page="tables.trajectoryParams.pageIndex"
          :page-sizes="tables.pageSizes"
          :page-size="tables.trajectoryParams.pageSize"
          layout="total,prev, pager, next"
          :total="tables.trajectoryParams.total"
        ></el-pagination>
      </div>
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
import { orderList, orderMapList, orderDetall } from '@/api/order';
import * as screenfull from 'screenfull';
import { pickerOptions } from '@/utils/index';
import '@/directives/dialogCtrl.js';
export default {
  data() {
    return {
      popoverState: false,
      dialogTableVisible: false,
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        dialogVisible: false,
        dialogVisibleDetails: false,
        pageSizes: [10, 20, 30, 40],
        rows: null,
        postParams: {
          data: [],
          orderNo: '',
          customerOrderNo: '',
          khgNo: '',
          KeyValue: 'orderlist',
          startTime: '',
          OrderStatus: '',
          endTime: '',
          pageSize: 15,
          pageIndex: 1,
          total: 0
        },
        trajectoryParams: {
          data: [],
          keyValue: 'orderlistmap',
          shipmentno: '',
          OrderNo: '',
          startTime: '',
          pageSize: 10,
          pageIndex: 1,
          total: 0
        },
        orderDetailParams: {
          data: [],
          idx: '',
          keyValue: 'orderlistDetall',
          pageSize: 10,
          pageIndex: 1,
          total: 0
        }
      },
      activeName: 'first',
      multipleSelection: [],
      form: {
        orderNumber: '', //DX3Q030000004900
        customerOrderNumber: '',
        creationTime: []
      },
      selects: {
        default: '',
        options: [
          {
            value: '已出库',
            label: '在途'
          },
          {
            value: '已交付',
            label: '已交付'
          },
          {
            value: '已回单',
            label: '已回单'
          }
        ]
      },
      MAPS: null,
      pathSimplifierIns: null,
      mapsData: [],
      orderMapListCache: [] //缓存订单轨迹信息
    };
  },
  methods: {
    orderDetallCurrentPage(currentPageNum) {
      this.tables.orderDetailParams.pageIndex = currentPageNum;
      this.orderDetails(this.tables.rows);
    },
    trajectoryCurrentPage(currentPageNum) {
      this.tables.trajectoryParams.pageIndex = currentPageNum;
      this._orderMapList(this.tables.rows); //
      // this._orderMapView(this.tables.rows);//
    },
    currentPage(currentPageNum) {
      this.tables.postParams.pageIndex = currentPageNum;
      this._orderList();
    },
    orderDetails(row) {
      this.tables.dialogVisibleDetails = true;
      this.tables.rows = row;
      this.tables.orderDetailParams.data = [];
      this.tables.orderDetailParams.idx = row.IDX;
      orderDetall(this.tables.orderDetailParams).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data;
          let OrderListDetall = data.data.OrderListDetall;
          this.tables.orderDetailParams.data = OrderListDetall;
          this.tables.orderDetailParams.total = data.counts;
        }
      });
    },
    queryOrders() {
      this.form.orderNumber = this.form.orderNumber.trim();
      this.form.customerOrderNumber = this.form.customerOrderNumber.trim();
      this.tables.postParams.orderNo = this.form.orderNumber;
      this.tables.postParams.customerOrderNo = this.form.customerOrderNumber;
      this.tables.postParams.startTime = this.form.creationTime.length
        ? this.form.creationTime[0]
        : '';
      this.tables.postParams.endTime = this.form.creationTime.length
        ? this.form.creationTime[1]
        : '';
      this.tables.postParams.OrderStatus = this.selects.default;
      this._orderList();
    },
    _orderList() {
      this.tables.postParams.data = [];
      orderList(this.tables.postParams).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data;
          let orderList = data.data.OrderList;
          this.tables.postParams.data = orderList;
          this.tables.postParams.total = data.counts;
        }
      });
    },
    _orderMapList(row, dialogGadMaps) {
      if (
        !(
          this.tables.trajectoryParams.OrderNo &&
          this.tables.trajectoryParams.OrderNo === row.ORD_NO
        )
      ) {
        this.tables.trajectoryParams.pageIndex = 1;
      }
      this.tables.dialogVisible = true;
      this.tables.trajectoryParams.data = [];
      this.tables.rows = row;
      this.tables.orderDetailParams.idx = row.IDX;
      this.tables.trajectoryParams.startTime = row.TMS_DATE_ISSUE;
      this.tables.trajectoryParams.shipmentno = row.TMS_SHIPMENT_NO;
      this.tables.trajectoryParams.OrderNo = row.ORD_NO;
      return orderMapList(this.tables.trajectoryParams).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data;
          let OrderListMapList = data.data.OrderListMapList;
          this.tables.trajectoryParams.data = OrderListMapList;
          this.mapsData = data.data.OrderListMap;
          this.tables.trajectoryParams.total = data.counts;
          return res.data;
        } else {
          return [];
        }
      });
    },
    _orderMapView(row) {
      window.open('http://www.668tms.com/map/index.html?OrdIDX=' + row.IDX);
    }
  },
  filters: {
    setLASTMILEAGE(val) {
      if (val && val !== '--') {
        return parseInt(val) / 1000;
      }
    },
    setLASTTIME(val) {
      if (val && val !== '--') {
        return (parseInt(val) / 3600).toFixed(2);
      }
    }
  },
  mounted() {
    this._orderList();
  }
};
</script>
