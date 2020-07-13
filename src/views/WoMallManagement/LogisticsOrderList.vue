<template>
  <div class="app-container">
    <div ref="searchForm" class="el-container-custom">
      <el-form
        :inline="true"
        v-show="true"
        :model="searchForm"
        ref="searchFormRef"
        size="small"
      >
        <el-form-item v-show="true" prop="orderNO">
          <el-input
            v-model="searchForm.orderNO"
            placeholder="请输入物流订单号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="contactNo">
          <el-input
            v-model="searchForm.contactNo"
            placeholder="请输入协议/电子合同编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="expressType">
          <el-select
            v-model="searchForm.expressType"
            filterable
            placeholder="请选择运输类型"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.expressType"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="ordType">
          <el-select
            v-model="searchForm.ordType"
            filterable
            placeholder="请选择物流单状态"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.ordType"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="default"
            size="small"
            @click="resetForm('searchFormRef')"
            >清空</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handleQueryBtnClickFunc()"
            >查询</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleExportBtnClickFunc()"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="el-container" ref="actionForm">
      <el-form :inline="true"> </el-form>
    </div>

    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.tableData"
      tooltip-effect="dark"
      size="mini"
      :cell-style="cellStyleFunc"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
      @sort-change="sortChangeFunc"
    >
      <el-table-column type="selection" width="45" fixed> </el-table-column>

      <el-table-column
        type="index"
        label="序号"
        width="45"
        fixed
      ></el-table-column>

      <el-table-column prop="orderNO" label="物流订单号" width="140" fixed>
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            @click="
              $router.push({
                name: 'relateUserInfo',
                params: { orderNO: scope.row.orderNO }
              })
            "
            >{{ scope.row.orderNO }}</a
          >
        </template>
      </el-table-column>

      <el-table-column
        prop="contactNo"
        label="协议/电子合同编号"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="signou"
        label="协议签署单位（省）"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="expressTypeDesc"
        label="运输类型"
        width="120"
      ></el-table-column>

      <el-table-column prop="weights" label="重量(kg)" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.weights">
            <span class="col-content">{{ scope.row.weights }}</span
            ><span class="col-suffix">{{ 'kg' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="expectedTime"
        label="预约上门取件时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="isLoadDesc"
        label="是否装卸"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="isStockDesc"
        label="是否送仓"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="isProtectDesc"
        label="是否装卸"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="declareValue"
        label="货物声明价值"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="protectedTaxRate"
        label="价保费率"
        width="120"
      ></el-table-column>

      <el-table-column prop="loadTaxPrice" label="装卸费（含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.loadTaxPrice">
            <span class="col-content">{{ scope.row.loadTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="stockTaxPrice" label="送仓费（含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.stockTaxPrice">
            <span class="col-content">{{ scope.row.stockTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="protectTaxPrice"
        label="价保费（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.protectTaxPrice">
            <span class="col-content">{{ scope.row.protectTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="addedPrice" label="追加费用（含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.addedPrice">
            <span class="col-content">{{ scope.row.addedPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="realPrice" label="运输价格（含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.realPrice">
            <span class="col-content">{{ scope.row.realPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="realTotalPrice"
        label="运输总价格（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.realTotalPrice">
            <span class="col-content">{{ scope.row.realTotalPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="ordTypeDesc"
        label="物流单状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="freezeStateDesc"
        label="冻结状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="operateStateDesc"
        label="订单操作状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="reason"
        label="取消原因"
        width="200"
      ></el-table-column>

      <el-table-column prop="remark" label="备注" width="120"></el-table-column>

      <el-table-column
        prop="addDate"
        label="创建时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="editDate"
        label="修改时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="operatorId"
        label="操作人"
        width="120"
      ></el-table-column>
    </el-table>

    <div ref="pagingBox" class="pagination-box">
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
  </div>
</template>
<script>
import md5 from 'md5';
import { Message } from 'element-ui';
import messages from '@/utils/messages';
import { tirmFilter } from '@/utils/tools';
import '@/directives/dialogCtrl.js';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import {
  validateNumber,
  validateMoblePhone,
  validateEmail
} from '@/utils/validate';
import {
  getLogisticsOrder,
  addQueueList
} from '@/api/WoMallManagement/logistics-order-list';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '',
        visible: false
      },
      selectArr: {
        expressType: [
          { label: '快递', value: '1' },
          { label: '零担', value: '2' }
        ],

        ordType: [
          { label: '草稿', value: '0' },
          { label: '询价结果审核', value: '1' },
          { label: '等待物流商接收确认', value: '2' },
          { label: '物流商接收确认', value: '3' },
          { label: '订单确认', value: '4' },
          { label: '订单作废', value: '5' },
          { label: '订单完成', value: '6' }
        ]
      },
      multipleSelection: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 280,
        tableData: [],
        pageSizes: [10, 20, 30, 40],
        rows: null,
        postParams: {
          currentPage: 1,
          pageSize: 50,
          total: 0,
          orderDirection: '',
          orderProp: ''
        }
      },
      searchForm: {
        orderNO: '',
        contactNo: '',
        expressType: '',
        ordType: ''
      },
      addForm: {
        data: {},
        config: {
          disabled: false
        },
        rules: {}
      },
      name: 'nihao'
    };
  },
  components: {},
  watch: {
    'searchForm.sendProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.sendCityId = this.getCities(val);
      if (this.selectArr.sendCityId && this.selectArr.sendCityId.length) {
        this.searchForm.sendCityId = this.selectArr.sendCityId[0].cityId;
      } else {
        this.searchForm.sendCityId = '';
      }
    },
    'searchForm.receiveProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.receiveCityId = this.getCities(val);
      if (this.selectArr.receiveCityId && this.selectArr.receiveCityId.length) {
        this.searchForm.receiveCityId = this.selectArr.receiveCityId[0].cityId;
      } else {
        this.searchForm.receiveCityId = '';
      }
    },
    'addForm.data.sendProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.sendCityIdAdd = this.getCities(val);
      if (this.selectArr.sendCityIdAdd && this.selectArr.sendCityIdAdd.length) {
        //   this.addForm.data.sendCityId = this.selectArr.sendCityIdAdd[0].cityId;
      } else {
        this.addForm.data.sendCityId = '';
      }
      this.getDirection();
      this.addForm.data.sendProvinceName = this.getAddressName(val);
    },
    'addForm.data.receiveProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.receiveCityIdAdd = this.getCities(val);
      if (
        this.selectArr.receiveCityIdAdd &&
        this.selectArr.receiveCityIdAdd.length
      ) {
        //   this.addForm.data.receiveCityId = this.selectArr.receiveCityIdAdd[0].cityId;
      } else {
        this.addForm.data.receiveCityId = '';
      }
      this.getDirection();
      this.addForm.data.receiveProvinceName = this.getAddressName(val);
    },
    'addForm.data.sendCityId': function(val, oldVal) {
      this.getDirection();
      this.addForm.data.sendCityName = this.getAddressName(val);
    },
    'addForm.data.receiveCityId': function(val, oldVal) {
      this.getDirection();
      this.addForm.data.receiveCityName = this.getAddressName(val);
    }
  },
  computed: {
    selectIds() {
      return this.multipleSelection.map(c => {
        return c.orderNO;
      });
    }
  },
  metas: {
    title: '',
    titleTemplate: '%s - 兆航物流TMS后台管理系统',

    'searchForm.sendProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.sendCityId = this.getCities(val);
      if (this.selectArr.sendCityId && this.selectArr.sendCityId.length) {
        this.searchForm.sendCityId = this.selectArr.sendCityId[0].cityId;
      } else {
        this.searchForm.sendCityId = '';
      }
    },
    'searchForm.receiveProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.receiveCityId = this.getCities(val);
      if (this.selectArr.receiveCityId && this.selectArr.receiveCityId.length) {
        this.searchForm.receiveCityId = this.selectArr.receiveCityId[0].cityId;
      } else {
        this.searchForm.receiveCityId = '';
      }
    },
    'addForm.data.sendProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.sendCityIdAdd = this.getCities(val);
      if (this.selectArr.sendCityIdAdd && this.selectArr.sendCityIdAdd.length) {
        //   this.addForm.data.sendCityId = this.selectArr.sendCityIdAdd[0].cityId;
      } else {
        this.addForm.data.sendCityId = '';
      }
      this.getDirection();
      this.addForm.data.sendProvinceName = this.getAddressName(val);
    },
    'addForm.data.receiveProvinceId': function(val, oldVal) {
      //省市联动
      this.selectArr.receiveCityIdAdd = this.getCities(val);
      if (
        this.selectArr.receiveCityIdAdd &&
        this.selectArr.receiveCityIdAdd.length
      ) {
        //   this.addForm.data.receiveCityId = this.selectArr.receiveCityIdAdd[0].cityId;
      } else {
        this.addForm.data.receiveCityId = '';
      }
      this.getDirection();
      this.addForm.data.receiveProvinceName = this.getAddressName(val);
    },
    'addForm.data.sendCityId': function(val, oldVal) {
      this.getDirection();
      this.addForm.data.sendCityName = this.getAddressName(val);
    },
    'addForm.data.receiveCityId': function(val, oldVal) {
      this.getDirection();
      this.addForm.data.receiveCityName = this.getAddressName(val);
    }
  },
  methods: {
    setTableMaxHeight() {
      setTimeout(() => {
        let height =
          document.body.clientHeight -
          125 -
          (this.$refs.searchForm.clientHeight +
            this.$refs.actionForm.clientHeight +
            this.$refs.pagingBox.clientHeight);
        this.tables.tableMaxHeight = height;
      }, 200);
    },
    searchFormMethod(currentPage, needSaveSelect = true) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      tirmFilter(this.searchForm);
      let data = _.assignIn({}, this.searchForm);
      data.pageSize = this.tables.postParams.pageSize;
      data.pageIndex = this.tables.postParams.currentPage;
      this.queryData(data, needSaveSelect);
    },
    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },

    handleQueryBtnClickFunc() {
      this.searchFormMethod(1, false);
    },
    handleExportBtnClickFunc() {
      tirmFilter(this.searchForm);
      let data = _.assign({ pageIndex: 1, pageSize: 10000 }, this.searchForm);
      getLogisticsOrder(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '物流订单号,协议/电子合同编号,协议签署单位（省）,运输类型,重量(kg),预约上门取件时间,是否装卸,是否送仓,是否装卸,货物声明价值,价保费率,装卸费（含税）,送仓费（含税）,价保费（含税）,追加费用（含税）,运输价格（含税）,运输总价格（含税）,物流单状态,冻结状态,订单操作状态,取消原因,备注,创建时间,修改时间,操作人';
            let fields =
              'orderNO,contactNo,signou,expressTypeDesc,weights,expectedTime,isLoadDesc,isStockDesc,isProtectDesc,declareValue,protectedTaxRate,loadTaxPrice,stockTaxPrice,protectTaxPrice,addedPrice,realPrice,realTotalPrice,ordTypeDesc,freezeStateDesc,operateStateDesc,reason,remark,addDate,editDate,operatorId';
            tableToExcel(res.data.data, cols, fields);
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
    queryData(data, needSaveSelect) {
      getLogisticsOrder(
        data
          ? data
          : {
              pageSize: this.tables.postParams.pageSize,
              pageIndex: this.tables.postParams.currentPage
            }
      )
        .then(res => {
          if (res.data.resultCode === 1) {
            let data = res.data.data;
            for (let item of data) {
              if (
                !isNaN(item.weights) &&
                item.weights !== '' &&
                item.weights !== null
              ) {
                let weights = new Big(item.weights || 0);
                item.weights = parseFloat(weights.toFixed(3));
              }

              if (
                !isNaN(item.loadTaxPrice) &&
                item.loadTaxPrice !== '' &&
                item.loadTaxPrice !== null
              ) {
                let loadTaxPrice = new Big(item.loadTaxPrice || 0);
                item.loadTaxPrice = parseFloat(loadTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.stockTaxPrice) &&
                item.stockTaxPrice !== '' &&
                item.stockTaxPrice !== null
              ) {
                let stockTaxPrice = new Big(item.stockTaxPrice || 0);
                item.stockTaxPrice = parseFloat(stockTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.protectTaxPrice) &&
                item.protectTaxPrice !== '' &&
                item.protectTaxPrice !== null
              ) {
                let protectTaxPrice = new Big(item.protectTaxPrice || 0);
                item.protectTaxPrice = parseFloat(protectTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.addedPrice) &&
                item.addedPrice !== '' &&
                item.addedPrice !== null
              ) {
                let addedPrice = new Big(item.addedPrice || 0);
                item.addedPrice = parseFloat(addedPrice.toFixed(4));
              }

              if (
                !isNaN(item.realPrice) &&
                item.realPrice !== '' &&
                item.realPrice !== null
              ) {
                let realPrice = new Big(item.realPrice || 0);
                item.realPrice = parseFloat(realPrice.toFixed(4));
              }

              if (
                !isNaN(item.realTotalPrice) &&
                item.realTotalPrice !== '' &&
                item.realTotalPrice !== null
              ) {
                let realTotalPrice = new Big(item.realTotalPrice || 0);
                item.realTotalPrice = parseFloat(realTotalPrice.toFixed(4));
              }
            }
            this.tables.tableData = data;
            if (needSaveSelect) {
              for (let item of this.multipleSelection) {
                let obj = _.find(this.tables.tableData, {
                  orderNO: item.orderNO
                });
                if (obj) {
                  setTimeout(() => {
                    console.log(obj);
                    this.$refs.multipleTable.toggleRowSelection(obj, true);
                  }, 0);
                }
              }
            }
            if (res.data.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
            }
            return;
          }
          this.tables.tableData = [];
          Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        })
        .catch(err => {
          Message({
            message: err,
            type: 'error',
            duration: 3 * 1000
          });
        });
    },

    sortChangeFunc(obj) {
      this.tables.postParams.orderDirection = obj.order;
      this.tables.postParams.orderProp = obj.prop;
      this.searchFormMethod(1, false);
    },

    cellStyleFunc(obj) {
      if (obj.columnIndex === 2) {
        return 'color:#409EFF';
      } else {
        return '';
      }
    },
    getAddressName(id) {
      let items = this.addressData.filter(item => {
        return item.id == id;
      });
      if (items && items.length) {
        return items[0].name;
      } else {
        return '';
      }
    },
    setProvinces() {
      let provinces = [];
      provinces = this.addressData.filter(item => {
        return item.level == 1;
      });
      provinces = provinces.map(item => {
        return { provinceId: item.id, provinceName: item.name };
      });
      this.selectArr.provinces = provinces;
    },
    getCities(provinceId) {
      if (!provinceId) {
        return [];
      }
      let cities = [];
      cities = this.addressData.filter(item => {
        return item.level == 2 && item.pId == provinceId;
      });
      cities = cities.map(item => {
        return { cityId: item.id, cityName: item.name };
      });
      return cities;
    },
    getDirection() {
      if (this.addForm.data.sendCityId && this.addForm.data.receiveCityId) {
        let result = this.addressData.filter(c => {
          return (
            c.id == this.addForm.data.sendCityId ||
            c.id == this.addForm.data.receiveCityId
          );
        });
        if (result.length == 2) {
          let directs = [];
          let c1 = result[0].name + '-' + result[1].name;
          let c2 = result[1].name + '-' + result[0].name;
          directs.push({ label: c1, value: c1 });
          directs.push({ label: c2, value: c2 });
          this.selectArr.direction = directs;
        } else if (result.length == 1) {
          let directs = [];
          let c1 = result[0].name + '-' + result[0].name;
          directs.push({ label: c1, value: c1 });
          this.selectArr.direction = directs;
        } else {
          this.selectArr.direction = [];
        }
      } else {
        this.selectArr.direction = [];
      }
      if (this.selectArr.direction.length) {
        this.addForm.data.direction = this.selectArr.direction[0].value;
      } else {
        this.addForm.data.direction = '';
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    subAddForm() {
      this.$refs['addFormRef'].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.addForm.data));
          //清楚左右空格
          tirmFilter(data);
          //将百分号的项除以100后保存

          //1是编辑，二是新增
          if (this.dialog.status === 1) {
            return this.submitEditData(data);
          } else {
            this.submitAddData(data);
          }
        } else {
          return false;
        }
      });
    }
  },
  activated() {},
  mounted() {
    this.setTableMaxHeight();
  },
  created() {},
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
<style>
.el-table .el-button {
  margin: 5px;
}
.port-de {
  margin: 0 auto;
}
h3 {
  font-size: 18px;
  font-weight: 400;
}
.dialog-content {
}
</style>
