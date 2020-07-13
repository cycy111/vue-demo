<template>
  <div class="app-container" ref="reportBox">
    <div class="el-container-custom">
      <el-container>
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchFormRef"
          size="small"
        >
          <el-form-item label="" :label-width="'80px'" prop="monthly" clearable>
            <el-date-picker
              format="yyyyMM"
              value-format="yyyyMM"
              v-model="searchForm.monthly"
              type="month"
              placeholder="选择月份"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="queryReportList"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="default"
              size="small"
              @click="resetForm('searchFormRef')"
              >清空</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="medium" @click="markPage"
              ><i class="el-icon-circle-plus-outline"></i>新增</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
    </div>
    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.data"
      tooltip-effect="dark"
      size="mini"
      @selection-change="
        val => {
          return (this.multipleSelection = val);
        }
      "
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        prop="deptName"
        label="项目名称"
        width="100"
      ></el-table-column>
      <el-table-column prop="years" label="年份" width="100"></el-table-column>
      <el-table-column prop="months" label="月份" width="100"></el-table-column>
      <el-table-column
        prop="creator"
        label="创建人"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        width="100"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="showPage(caozuo.row, false)"
            ><i class="iconfont icon-pdf"></i>查看</el-button
          >
          <!-- <el-button size="mini" @click="markPage"><i class="iconfont icon-bj"></i>编辑</el-button> -->
          <el-button size="mini" @click="showPage(caozuo.row, true)"
            ><i class="iconfont icon-bj"></i>编辑</el-button
          >
          <!-- <el-button size="mini" v-if="caozuo.row.filePath" @click="exportPdf(caozuo.row)"><i class="iconfont el-icon-check"></i>导出</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        small
        @size-change="sizeChange"
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
      :modal="false"
      :fullscreen="true"
      :title="titleName"
      :visible.sync="dialogView"
      :before-close="dialogClose"
    >
      <div class="start-print"></div>
      <div id="report-container" class="dialog-container" ref="dialogBody">
        <!-- <h1>ejfie</h1> -->

        <div>&nbsp;</div>
        <h-title
          ref="hTitle"
          :hTitleOne="hTitleOne"
          :isCreateNew="isCreateNew"
          style="margin:10px 0px;"
          :use-department-data="useDepartmentData"
          @updateHTitle="updateHTitle"
          @dynamic-components-event="getDynamicComponentsListArr"
        ></h-title>
        <component
          :is="item.component"
          :year="ParamList.years"
          :month="ParamList.months"
          :deptCode="ParamList.deptCode"
          :edit="edit"
          :title="item.title"
          :isChart="item.isChart"
          :dataKey="item.dataKey"
          :table-data="item.data"
          :textareaValue="item.textareaValue"
          :textareaValueTwo="item.textareaValueTwo"
          :textareaPosition="item.textareaPosition"
          v-for="(item, index) in addComponents"
          :key="index"
          @input="modelFn"
        ></component>
        <div>&nbsp;</div>

        <suspension-menu
          :edit="edit"
          :use-department-data="useDepartmentData"
          :childVal="ParamList"
          @dialog-visible-event="dialogViewEvent"
          :addComponentsList="addComponents"
          @re-render-components="reRenderComponents"
        ></suspension-menu>
      </div>
      <div class="end-print"></div>
    </el-dialog>
  </div>
</template>

<script>
//通过this.Bus.$emit和this.Bus.$on触发传递参数(只能是子类之间互相通信)
//通过prop实现父类传递参数给子类，参考suspension-menu传参
//通过this.$emit实现子类给父类传递参数和父类传递类似
import MonthlyReportTable from './componests/MonthlyReportTable';
import MonthlyDepositTables from './componests/MonthlyDepositTables';
import MonthlyReportInputTable from './componests/MonthlyReportInputTable';
import MonthlyPersonInfoTables from './componests/MonthlyPersonInfoTables';
import MonthlyOrderInfoTable from './componests/MonthlyOrderInfoTable';
import MonthlyPlanInfoTable from './componests/MonthlyPlanInfoTable';
import MonthlyCheckInfoTable from './componests/MonthlyCheckInfoTable';
import { fileBaseUrl } from '@/constant';
import HTitle from './componests/HTitle';
import SuspensionMenu from './componests/SuspensionMenu';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import Big from 'big.js';
var _ = require('lodash');
import '@/styles/custom.scss';
import {
  getOperatingReportList,
  geReportItemInfo,
  addReportItem,
  getReportFile
} from '@/api/yuebao/report';

import { Message } from 'element-ui';
const itemCode = [];
//const itemList = [];
export default {
  name: 'monthlyReport',
  components: {
    MonthlyReportTable,
    HTitle,
    SuspensionMenu,
    MonthlyReportInputTable,
    MonthlyDepositTables,
    MonthlyPersonInfoTables,
    MonthlyOrderInfoTable,
    MonthlyPlanInfoTable,
    MonthlyCheckInfoTable
  },
  data() {
    return {
      addComponents: [],
      dialogView: false,
      searchForm: {
        deptCode: '',
        monthly: ''
      },
      edit: false,
      ParamList: {
        deptCode: '',
        years: '',
        months: ''
      },
      titleName: '',
      useDepartmentData: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        data: [],
        dialogVisible: false,
        dialogVisibleDetails: false,
        pageSizes: [10, 20, 30, 40],
        postParams: {
          currentPage: 1,
          pageSize: 1,
          total: 0
        }
      },
      tableTitle: {
        kpiData: 'KPI指标情况',
        amountInfo: '本月出入库对比情况',
        orderInfo: '仓库总体单据情况',
        sAmountInfo: '仓库数量排名靠前的主要物资',
        dullInfoBySixMonths: '超6个月呆滞数量前10物资',
        dullInfoByTwoYears: '超2年呆滞数量前10物资',
        planInfo: '预约情况通报',
        cBillInfo: '盘点情况通报',
        personInfo: '人员变动情况',
        whcodeArea: '仓库总体面积使用'
      },
      hTitleOne: '点我开始生成运营报告标题',
      isCreateNew: false
    };
  },
  computed: {
    deptCode() {
      return this.$store.getters.deptCode;
    }
  },
  watch: {
    deptCode(newVal, oldVal) {
      this.queryReportList();
    }
  },
  methods: {
    editMethod() {},
    updateHTitle(val) {
      this.hTitleOne = val;
    },
    dialogViewEvent(close) {
      this.dialogClose();
      //console.log(close);
    },
    //   获取要生成的月报模板数据
    /*
			  data '回传回来的ajax数据'
			  callbackPramas '勾选的参数'
			  itemList '所有模块数据'
		*/
    getDynamicComponentsListArr(data, callbackPramas, itemList, edit) {
      let components = [];
      let index = 1;
      //根据传入参数和返回的参数清洗出新数据
      let obj = {};
      callbackPramas.forEach(item => {
        obj[item] = [];
        Object.keys(data).forEach(val => {
          if (item === val) {
            if (data[val].length === 0) {
              data[val].push({
                itemName: this.tableTitle[val],
                data: '没有数据!'
              });
            }
            if (item !== 'reportDesInfo') {
              obj[item] = data[val];
            }
          }
        });
      });
      var remarkData = data['reportDesInfo'];
      Object.keys(obj).forEach(item => {
        //获取备注
        let remark = '';
        _.forEach(remarkData, function(item1) {
          if (item1.reportItemCode === item) {
            remark = item1.remark;
          }
        });
        switch (item) {
          case 'personInfo':
            components.push({
              component: 'MonthlyPersonInfoTables',
              title: index++ + '.' + obj[item][0].itemName,
              data: data[item],
              dataKey: item,
              isChart: false,
              edit: edit
            });
            break;
          //仓库总体面积使用
          case 'whcodeArea':
            components.push({
              component: 'MonthlyReportInputTable',
              title: index++ + '.' + obj[item][0].itemName,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              data: data[item][0].data === '没有数据!' ? [] : data[item],
              //data:[],
              dataKey: item,
              textareaPosition: 'bottom',
              textareaValue: remark,
              edit: edit
            });
            break;
          // 本月出入库对比情况
          case 'amountInfo':
            components.push({
              component: 'MonthlyDepositTables',
              title: index++ + '.' + obj[item][0].itemName,
              data: data[item][0].data === '没有数据!' ? undefined : data[item],
              dataKey: item,
              textareaPosition: 'bottom',
              textareaValue: remark,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // 超6个月呆滞金额前10物资
          case 'dullInfoBySixMonths':
            var tableData =
              data[item][0].data === '没有数据!' ? undefined : data[item];
            if (tableData) {
              for (let item of tableData) {
                if (item.kcAmount) {
                  item.kcAmount = parseFloat(
                    new Big(item.kcAmount).div(10000).toFixed(2)
                  );
                }
              }
            }
            components.push({
              component: 'MonthlyReportTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: tableData,
              dataKey: item,
              textareaPosition: 'bottom',
              textareaValue: remark,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // 超2年呆滞数量前10物资
          case 'dullInfoByTwoYears':
            tableData =
              data[item][0].data === '没有数据!' ? undefined : data[item];
            if (tableData) {
              for (let item of tableData) {
                if (item.kcAmount) {
                  item.kcAmount = parseFloat(
                    new Big(item.kcAmount).div(10000).toFixed(2)
                  );
                }
              }
            }
            components.push({
              component: 'MonthlyReportTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: tableData,
              dataKey: item,
              textareaPosition: 'bottom',
              textareaValue: remark,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // 仓库金额排名靠前的主要物资
          case 'sAmountInfo':
            tableData =
              data[item][0].data === '没有数据!' ? undefined : data[item];
            if (tableData) {
              for (let item of tableData) {
                if (item.kcAmount) {
                  item.kcAmount = parseFloat(
                    new Big(item.kcAmount).div(10000).toFixed(2)
                  );
                }
              }
            }
            components.push({
              component: 'MonthlyReportTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: tableData,
              dataKey: item,
              textareaPosition: 'bottom',
              textareaValue: remark,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // KPI指标情况
          case 'kpiData':
            components.push({
              component: 'MonthlyReportTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: data[item],
              dataKey: item,
              textareaPosition: 'bottom',
              textareaValue: remark,
              isChart: data[item][0] === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // 仓库总体单据情况
          case 'orderInfo':
            components.push({
              component: 'MonthlyOrderInfoTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: data[item][0].data === '没有数据!' ? undefined : data[item],
              dataKey: item,
              textareaPosition: 'top',
              textareaValue: remark,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // 预约情况
          case 'planInfo':
            components.push({
              component: 'MonthlyPlanInfoTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: data[item],
              dataKey: item,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          // 盘点情况
          case 'cBillInfo':
            components.push({
              component: 'MonthlyCheckInfoTable',
              title: index++ + '.' + obj[item][0].itemName,
              data: data[item],
              dataKey: item,
              isChart: data[item][0].data === '没有数据!' ? false : true,
              edit: edit
            });
            break;
          default:
            try {
              components.push({
                component: 'MonthlyReportTable',
                title: index++ + '.' + obj[item][0].itemName,
                data: data[item],
                dataKey: item,
                textareaPosition: 'bottom',
                textareaValue: remark,
                isChart: data[item][0].data === '没有数据!' ? false : true,
                edit: edit
              });
              break;
            } catch (e) {
              // console.log(item);
              // console.log(JSON.stringify(obj));
            }
        }
      });
      this.addComponents = components;
    },
    dialogClose() {
      //重置页面
      this.dialogView = false;
      this.$refs.hTitle.monthly = '';
      this.$refs.hTitle.form.deptCode = '';
      this.$refs.hTitle.hOneShow = true;
      this.$refs.hTitle.hOne = '点我开始生成运营报告标题';
      this.addComponents = [];
    },
    //新增或修改备注后，重新回填备注信息
    reRenderComponents(callValueArr) {
      var addComponents = this.addComponents.slice(0);
      this.addComponents = [];
      for (var i = 0; i < callValueArr.length; i++) {
        for (var j = 0; j < addComponents.length; j++) {
          if (callValueArr[i].dataKey === addComponents[j].dataKey) {
            addComponents[j].textareaValue = callValueArr[i].textareaValue;
            if (callValueArr[i].textareaValueTwo) {
              addComponents[j].textareaValueTwo =
                callValueArr[i].textareaValueTwo;
            }
            break;
          }
        }
      }
      this.$nextTick(() => {
        this.addComponents = addComponents;
      });
    },
    exportPdf(row) {
      getReportFile(row.rptId)
        .then(function(res) {
          if (res.data.resultCode == 1) {
            window.open(fileBaseUrl + res.data.data, '_blank');
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 2 * 1000
            });
          }
        })
        .catch(function(err) {
          Message({
            message: err,
            type: 'error',
            duration: 2 * 1000
          });
        });
    },
    markPage() {
      this.dialogView = true;
      this.isCreateNew = true;
      this.hTitleOne = '点我开始生成运营报告标题';
    }, //this.$emit("dynamic-components-event",data); 子组件调父组件方法
    showPage(row, edit) {
      this.edit = edit;
      this.ParamList.deptCode = row.deptCode;
      this.ParamList.years = row.years;
      this.ParamList.months = row.months;
      this.isCreateNew = false; //不是新增
      let m = /^\d$/.test(row.months) ? '0' + row.months : row.months;
      this.hTitleOne = row.deptName + '(' + row.years + m + ')' + '运营报告';
      //this.titleName = row.years + "/" + row.months + "运营月报项目编辑";
      geReportItemInfo({
        FindType: 'reportItemDt',
        DeptCode: row.deptCode,
        Remark: 'LasterVersion'
      }).then(res => {
        //data中定义的字段在结果集中也是获取不到的(this.itemCode)！！！
        if (res.data.resultCode === 1 && res.data.data.reportItem.length) {
          let data = res.data.data.reportItem[0].item;
          if (data.length) {
            for (var i = 0; i < data.length; i++) {
              itemCode.push(data[i].itemCode);
            }
            this.LoadPageList(row.deptCode, row.years, row.months, edit);
          }
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    LoadPageList(deptCode, years, months, edit) {
      return this._getOperatingReportList(
        {
          deptCode: deptCode,
          years: years,
          months: months,
          findType: itemCode.join(',') + ',reportDesInfo',
          title: this.tableTitle
        },
        edit
      ).then(result => {
        if (result.data.resultCode === 1) {
          this.Bus.$emit('getHTitleData', {
            deptCode: deptCode,
            years: years,
            months: months
          });
        }
      });
    },

    _getOperatingReportList(data, edit) {
      return getOperatingReportList(data).then(res => {
        let itemCode = data.findType.split(','); //[kpiData,amountInfo,...]
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          this.dialogView = true;
          this.getDynamicComponentsListArr(data, itemCode, data.title, edit);
          return res;
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 1 * 1000
        });
      });
    },
    modelFn(val, dataKeys) {
      this.addComponents.forEach(item => {
        if (
          item.dataKey === dataKeys.dataKey &&
          dataKeys.keyCode === 'textareaModelValueTwo'
        ) {
          item.textareaValueTwo = val;
        }
        if (
          item.dataKey === dataKeys.dataKey &&
          dataKeys.keyCode !== 'textareaModelValueTwo'
        ) {
          item.textareaValue = val;
        }
      });
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    queryReportList() {
      getOperatingReportList({
        deptCode: this.deptCode,
        years: this.searchForm.monthly.slice(0, 4),
        months: this.searchForm.monthly.slice(4),
        findtype: 'MonReportList'
      }).then(res => {
        if (res.data.resultCode === 1) {
          return (this.tables.data = res.data.data.monReportList);
        }
        if (res.data.data) {
          res.data.data.monReportList = [];
        }
      });
    }
  },
  created() {
    this.queryReportList();
    this.Bus.$on('changeEditStatus', e => {
      this.edit = e;
    });
    this.Bus.$on('getHTitleData', e => {
      this.ParamList.deptCode = e.deptCode;
      this.ParamList.years = e.years;
      this.ParamList.months = e.months;
    });
  }
};
</script>
<style>
#report-container {
  width: 210mm;
  margin: 0px auto;
}
</style>
