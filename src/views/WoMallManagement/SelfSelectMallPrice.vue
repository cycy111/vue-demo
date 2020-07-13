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
        <el-form-item v-show="true" prop="applyNO">
          <el-input
            v-model="searchForm.applyNO"
            placeholder="请输入申请单号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="fleetId">
          <el-select
            v-model="searchForm.fleetId"
            filterable
            placeholder="请选择承运商"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.carrier"
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

      <el-table-column
        prop="applyNO"
        label="申请单号"
        width="120"
        fixed
      ></el-table-column>

      <el-table-column
        prop="fleetName"
        label="承运商名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="loadCTaxPrice"
        label="装卸费成本（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.loadCTaxPrice">
            <span class="col-content">{{ scope.row.loadCTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="loadTaxPrice"
        label="装卸费销售（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.loadTaxPrice">
            <span class="col-content">{{ scope.row.loadTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="loadCPrice"
        label="装卸费成本（不含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.loadCPrice">
            <span class="col-content">{{ scope.row.loadCPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="loadPrice"
        label="装卸费销售（不含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.loadPrice">
            <span class="col-content">{{ scope.row.loadPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="loadPriceUnitDesc"
        label="装卸费单位"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="stockCTaxPrice"
        label="送仓费成本(含税)"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.stockCTaxPrice">
            <span class="col-content">{{ scope.row.stockCTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="stockTaxPrice"
        label="送仓费销售(含税)"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.stockTaxPrice">
            <span class="col-content">{{ scope.row.stockTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="stockCPrice"
        label="送仓费成本(不含税)"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.stockCPrice">
            <span class="col-content">{{ scope.row.stockCPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="stockPrice" label="送仓费销售(不含税)" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.stockPrice">
            <span class="col-content">{{ scope.row.stockPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="stockPriceUnitDesc"
        label="送仓费单位"
        width="120"
      ></el-table-column>

      <el-table-column prop="taxRate" label="税率" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.taxRate">
            <span class="col-content">{{ scope.row.taxRate }}</span
            ><span class="col-suffix">{{ '%' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注" width="120"></el-table-column>

      <el-table-column
        prop="operationTypeDesc"
        label="操作"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="startDate"
        label="起始有效期"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="endDate"
        label="结束有效期"
        width="140"
      ></el-table-column>

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
  getPriceApplyZX,
  getFleetList
} from '@/api/WoMallManagement/self-select-mall-price';

import { getAreaList } from '@/api/WoMallManagement/address';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {},
      dialog: {
        title: '自选费用商城价格',
        visible: false
      },
      selectArr: {
        carrier: []
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
        id: '',
        applyNO: '',
        fleetId: ''
      },
      addForm: {
        data: {},
        config: {
          disabled: false
        },
        rules: {}
      }
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
    },
    'addForm.data.fleetId': function(val, oldVal) {
      let obj = _.find(this.selectArr.carrier, { value: val });
      if (obj) {
        this.addForm.data.fleetName = obj.label;
      } else {
        this.addForm.data.fleetName = '';
      }
    }
  },
  computed: {
    selectIds() {
      return this.multipleSelection.map(c => {
        return c.id;
      });
    }
  },
  metas: {
    title: '自选费用商城价格',
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
    },
    'addForm.data.fleetId': function(val, oldVal) {
      let obj = _.find(this.selectArr.carrier, { value: val });
      if (obj) {
        this.addForm.data.fleetName = obj.label;
      } else {
        this.addForm.data.fleetName = '';
      }
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
      getPriceApplyZX(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '申请单号,承运商名称,装卸费成本（含税）,装卸费销售（含税）,装卸费成本（不含税）,装卸费销售（不含税）,装卸费单位,送仓费成本(含税),送仓费销售(含税),送仓费成本(不含税),送仓费销售(不含税),送仓费单位,税率,备注,操作,起始有效期,结束有效期,创建时间,修改时间,操作人';
            let fields =
              'applyNO,fleetName,loadCTaxPrice,loadTaxPrice,loadCPrice,loadPrice,loadPriceUnitDesc,stockCTaxPrice,stockTaxPrice,stockCPrice,stockPrice,stockPriceUnitDesc,taxRate,remark,operationTypeDesc,startDate,endDate,addDate,editDate,operatorId';
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
      getPriceApplyZX(
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
                !isNaN(item.loadCTaxPrice) &&
                item.loadCTaxPrice !== '' &&
                item.loadCTaxPrice !== null
              ) {
                let loadCTaxPrice = new Big(item.loadCTaxPrice || 0);
                item.loadCTaxPrice = parseFloat(loadCTaxPrice.toFixed(4));
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
                !isNaN(item.loadCPrice) &&
                item.loadCPrice !== '' &&
                item.loadCPrice !== null
              ) {
                let loadCPrice = new Big(item.loadCPrice || 0);
                item.loadCPrice = parseFloat(loadCPrice.toFixed(4));
              }

              if (
                !isNaN(item.loadPrice) &&
                item.loadPrice !== '' &&
                item.loadPrice !== null
              ) {
                let loadPrice = new Big(item.loadPrice || 0);
                item.loadPrice = parseFloat(loadPrice.toFixed(4));
              }

              if (
                !isNaN(item.stockCTaxPrice) &&
                item.stockCTaxPrice !== '' &&
                item.stockCTaxPrice !== null
              ) {
                let stockCTaxPrice = new Big(item.stockCTaxPrice || 0);
                item.stockCTaxPrice = parseFloat(stockCTaxPrice.toFixed(4));
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
                !isNaN(item.stockCPrice) &&
                item.stockCPrice !== '' &&
                item.stockCPrice !== null
              ) {
                let stockCPrice = new Big(item.stockCPrice || 0);
                item.stockCPrice = parseFloat(stockCPrice.toFixed(4));
              }

              if (
                !isNaN(item.stockPrice) &&
                item.stockPrice !== '' &&
                item.stockPrice !== null
              ) {
                let stockPrice = new Big(item.stockPrice || 0);
                item.stockPrice = parseFloat(stockPrice.toFixed(4));
              }

              if (
                !isNaN(item.taxRate) &&
                item.taxRate !== '' &&
                item.taxRate !== null
              ) {
                let taxRate = new Big(item.taxRate || 0);
                item.taxRate = parseFloat(taxRate.times(100).toFixed(2));
              }
            }
            this.tables.tableData = data;
            if (needSaveSelect) {
              for (let item of this.multipleSelection) {
                let obj = _.find(this.tables.tableData, {
                  id: item.id
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

    getFleetData() {
      let data = { pageindex: 1, pageSize: 10000 };
      getFleetList(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let data = res.data.data;
            this.selectArr.carrier = data.map(c => {
              return { label: c.fleetName, value: c.fleetId };
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
    handleGenSales(obj) {
      console.log('销售价生成成功');
      let data = {
        ...obj,
        codeIds: this.selectIds
      };
      undefined(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            return Message({
              message: '生成成功',
              type: 'error',
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

          if (data.taxRate) {
            let taxRate = new Big(data.taxRate || 0);
            data.taxRate = parseFloat(taxRate.div(100).toFixed(4));
          }
          //保存的时候，如果字段为空就将其转换为"EmptyString","null"
          for (let prop of Object.getOwnPropertyNames(data)) {
            if (data[prop] === '') {
              data[prop] = 'null';
            } else if (data[prop] === null) {
              data[prop] = 'null';
            }
          }

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

    this.getFleetData();
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
