<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchFormRef"
        :rules="searchRules"
        size="small"
        class="search-form"
      >
        <el-form-item label="月份范围" prop="searchDate">
          <el-date-picker
            v-model="searchForm.searchDate"
            type="monthrange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="checkType">
          <el-input
            v-model="searchForm.productCode"
            placeholder="请输入物资编号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="入库组织" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.inOrganize"
            filterable
            placeholder="请选择入库组织"
          >
            <el-option
              v-for="(item, index) in inOrganizations"
              :key="index"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物资类别" :label-width="'80px'" clearable>
          <el-select
            v-model="searchForm.productType"
            filterable
            placeholder="请选择物资类别"
          >
            <el-option
              v-for="(item, index) in productTypes"
              :key="index"
              :label="item.value"
              :value="item.key"
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
          <el-button type="primary" size="small" @click="searchFormMethod(1)"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="downStorageSetList"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.tableData"
      tooltip-effect="dark"
      :cell-style="{ 'text-align': 'center' }"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column
        prop="productCode"
        label="物资编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="productName"
        label="物资名称"
        width="300"
      ></el-table-column>
      <el-table-column
        prop="productUnit"
        label="单位"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="inOrganize"
        label="入库组织"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="productType"
        label="物资类别"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="sqcQty"
        label="起初结余数"
        width="100"
      ></el-table-column>
      <el-table-column
        v-for="item in columns"
        :key="item.field"
        :prop="item.field"
        :label="item.key"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="eqcQty"
        label="期末结余数"
        width="100"
      ></el-table-column>
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
  </div>
</template>
<style lang="less">
.search-form .el-form-item__content input {
  width: 140px;
}
.el-table table thead tr th {
  color: #666;
}</style
>>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import { pickerOptions } from '@/utils/index';
import { tableToExcel } from '@/utils/cmn';
import Big from 'big.js';
import { getSelectData } from '@/api/dianwangManagement/borrowMaterialDetail';
import { getInvoicingReport } from '@/api/wmsQuery/invoicingStatistics';
import { Promise } from 'q';
import { debuglog } from 'util';
import * as moment from 'moment';
import '@/styles/custom.scss';
export default {
  name: 'invoicingStatistics',
  data() {
    return {
      useDepartmentData: [],
      currentPage: 1,
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        tableData: [],
        useDepartment: [],
        pageSizes: [10, 20, 30, 40],
        rows: null,
        multipleSelection: [],
        postParams: {
          currentPage: 1,
          pageSize: 50,
          total: 0,
          orderDirection: '',
          orderProp: ''
        }
      },
      inOrganizations: [],
      productTypes: [],
      borrowSelect: [
        { label: '全部', value: -1 },
        { label: '借料', value: 1 },
        { label: '挂账', value: 2 }
      ],
      columns: [],
      borrowMaterialRegions: [],
      searchForm: {
        deptCode: '',
        inOrganize: '',
        productType: '',
        productCode: '',
        searchDate: [moment().format('YYYY-MM'), moment().format('YYYY-MM')]
      },
      searchRules: {
        deptCode: [{ required: true, message: '请选择项目', trigger: 'change' }]
      }
    };
  },
  computed: {
    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  watch: {
    deptCode(newVal, oldVal) {
      //this.searchFormMethod(1);
    }
  },
  methods: {
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      getInvoicingReport({
        deptCode: this.deptCode,
        inOrganize: this.searchForm.inOrganize,
        productType: this.searchForm.productType,
        productCode: this.searchForm.productCode,
        beginTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[1]
          : '',
        pageSize: this.tables.postParams.pageSize,
        pageIndex: this.tables.postParams.currentPage
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              //生成列
              if (res.data.pageIndex == 1) {
                let dataOne = res.data.data[0];
                if (dataOne.dt && dataOne.dt.length) {
                  this.columns = dataOne.dt;
                }
              }

              for (let item of res.data.data) {
                // let lendQty = new Big(item.lendQty||0);
                // item.lendQty = parseFloat(lendQty.toFixed(2));
                // let relendQty = new Big(item.relendQty||0);
                // item.relendQty = parseFloat(relendQty.toFixed(2));
                // let getQty = new Big(item.getQty||0);
                // item.getQty = parseFloat(getQty.toFixed(2));
                // let reGetQty = new Big(item.reGetQty||0);
                // item.reGetQty = parseFloat(reGetQty.toFixed(2));
                for (let col of this.columns) {
                  //获取col对应的值
                  if (item.dt && item.dt.length) {
                    let result = item.dt.filter(c => {
                      return c.field == col.field;
                    });
                    if (result && result.length) {
                      item[col.field] = result[0].value;
                    }
                  }
                }
              }
            }
            this.tables.tableData = res.data.data;
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
    downStorageSetList() {
      getInvoicingReport({
        deptCode: this.deptCode,
        inOrganize: this.searchForm.inOrganize,
        productType: this.searchForm.productType,
        productCode: this.searchForm.productCode,
        beginTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[1]
          : '',
        pageSize: 20000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              if (res.data.pageIndex == 1) {
                let dataOne = res.data.data[0];
                if (dataOne.dt && dataOne.dt.length) {
                  this.columns = dataOne.dt;
                }
              }

              for (let item of res.data.data) {
                // let lendQty = new Big(item.lendQty||0);
                // item.lendQty = parseFloat(lendQty.toFixed(2));
                // let relendQty = new Big(item.relendQty||0);
                // item.relendQty = parseFloat(relendQty.toFixed(2));
                // let getQty = new Big(item.getQty||0);
                // item.getQty = parseFloat(getQty.toFixed(2));
                // let reGetQty = new Big(item.reGetQty||0);
                // item.reGetQty = parseFloat(reGetQty.toFixed(2));
                for (let col of this.columns) {
                  //获取col对应的值
                  if (item.dt && item.dt.length) {
                    let result = item.dt.filter(c => {
                      return c.field == col.field;
                    });
                    if (result && result.length) {
                      item[col.field] = result[0].value;
                    }
                  }
                }
              }
            }
            let data = res.data.data;
            let dateCols = '';
            let dateFields = '';
            for (let item of this.columns) {
              dateCols += item.key + ',';
              dateFields += item.field + ',';
            }
            let cols = `物资编号,物资名称,单位,入库组织,物资类别,起初结余数,${dateCols}期末结余数`;
            let fields = `productCode,productName,productUnit,inOrganize,productType,sqcQty,${dateFields}eqcQty`;
            tableToExcel(data, cols, fields);
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
    getDeptName(deptCode) {
      let depts = this.$store.getters.userDepartments;
      for (let item of depts) {
        if (item.value == deptCode) {
          return item.label;
        }
      }
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
      this.searchForm.inOrganize = '';
      this.searchForm.productType = '';
      this.searchForm.productCode = '';
      this.searchForm.searchDate = [
        moment().format('YYYY-MM'),
        moment().format('YYYY-MM')
      ];
    },

    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },

    async initSelectData() {
      getSelectData({ deptCode: this.deptCode, selectType: 1 }).then(res => {
        this.inOrganizations = this.getResData(res);
      });
      getSelectData({ deptCode: this.deptCode, selectType: 4 }).then(res => {
        this.productTypes = this.getResData(res);
      });
      // getSelectData({deptCode:this.deptCode,selectType:3}).then((res)=>{
      //   this.borrowMaterialRegions = this.getResData(res);
      // })
      // this.projects = this.getResData(res2);
      // this.borrowMaterialRegions = this.getResData(res3);
    },
    getResData(res) {
      if (res.data.resultCode == 1) {
        return res.data.data;
      } else {
        console.log(res.data.messages);
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
        return [];
      }
    }
  },
  created() {
    //this.searchFormMethod(1)
    this.initSelectData();
  }
};
</script>
