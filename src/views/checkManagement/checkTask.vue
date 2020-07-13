<template>
  <div class="app-container">
    <div class="el-container-custom">
      <el-container>
        <el-form
          :inline="true"
          :model="searchForm"
          ref="searchFormRef"
          size="small"
        >
          <el-form-item
            label=""
            :label-width="'80px'"
            prop="checkStatus"
            clearable
          >
            <el-select
              v-model="searchForm.checkStatus"
              placeholder="请选择盘点状态"
            >
              <el-option
                v-for="(item, index) in checkStatus"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" :label-width="'80px'" prop="isSame" clearable>
            <el-select
              v-model="searchForm.isSame"
              placeholder="请选择是否账实一致"
            >
              <el-option
                v-for="(item, index) in [
                  { label: '是', value: 1 },
                  { label: '否', value: 0 }
                ]"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="checkType">
            <el-input
              v-model="searchForm.creator"
              placeholder="请输入推送人"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="searchDate">
            <el-date-picker
              v-model="searchForm.searchDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="$util.pickerOptions"
            >
            </el-date-picker>
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
            <el-button type="success" size="small" @click="exportCheckList"
              >导出</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
      <el-container>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="success" size="medium " @click="addCheckTaskMethod"
              ><i class="el-icon-circle-plus-outline"></i>创建</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-popover placement="bottom" width="160" v-model="popoverVisible">
              <p>是否确定删除这些盘点任务？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="popoverVisible = false"
                  >取消</el-button
                >
                <el-button type="danger" size="mini" @click="batchDeleteFunc"
                  >确定</el-button
                >
              </div>
              <el-button type="danger" size="medium " slot="reference"
                ><i class="el-icon-delete"></i>批量删除</el-button
              >
            </el-popover>
          </el-form-item>
          <el-form-item>
            <el-popover
              placement="bottom"
              width="160"
              v-model="sendPopoverVisible"
            >
              <p>是否确定推送这些盘点任务?</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="sendPopoverVisible = false"
                  >取消</el-button
                >
                <el-button type="primary" size="mini" @click="batchSendFunc"
                  >确定</el-button
                >
              </div>
              <el-button type="primary" size="medium " slot="reference"
                ><i class="el-icon-upload"></i>批量推送</el-button
              >
            </el-popover>
          </el-form-item>
        </el-form>
      </el-container>
    </div>
    <el-table
      ref="multipleTable"
      border
      :max-height="tables.tableMaxHeight"
      :data="tables.checkTaskData"
      tooltip-effect="dark"
      size="mini"
      @selection-change="
        val => {
          return (this.tables.multipleSelection = val);
        }
      "
      :cell-style="cellStyleFunc"
      @sort-change="sortChangeFunc"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="45"></el-table-column>
      <el-table-column prop="checkNo" label="盘点任务单号" width="150">
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            @click="
              $router.push({
                path: '/checkManagement/checkTaskDt',
                query: {
                  checkNo: scope.row.checkNo,
                  addType: scope.row.addType
                }
              })
            "
            >{{ scope.row.checkNo }}</a
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="项目"
        width="150"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        prop="checkStatus"
        label="盘点状态"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="isSame"
        label="账实一致"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建人"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="" label="备注" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        prop="createDate"
        label="创建时间"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column
        prop="sendDate"
        label="推送时间"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <!-- <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
        width="150"
      ></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="caozuo">
          <el-popover
            placement="bottom"
            width="160"
            v-model="caozuo.row.visible"
          >
            <p>是否删除该盘点任务？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="caozuo.row.visible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="deleteCheckTaskBtnFunc(caozuo.row)"
                >确定</el-button
              >
            </div>
            <el-button size="mini" slot="reference" type="danger"
              ><i class="iconfont icon-shanchu"></i>删除</el-button
            >
          </el-popover>

          <el-button
            size="mini"
            slot="reference"
            type="primary"
            style="margin-left:10px;"
            @click="sendCheckTaskBtnFunc(caozuo.row)"
            ><i class="iconfont el-icon-upload"></i>推送</el-button
          >
          <!-- <el-button size="mini" @click="_deleteKpiInfo(caozuo.row)"><i class="iconfont icon-shanchu"></i>删除</el-button> -->
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
      title="创建盘点任务"
      @opened="dialogOpen"
      @close="dialogClose"
      :visible.sync="dialog.visible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <el-form
        size="small"
        :rules="dialog.rules"
        ref="createCheckForm"
        width="60%"
        :inline="true"
        :model="dialog.form"
      >
        <el-form-item
          label=""
          :label-width="'80px'"
          prop="regionCode"
          class="regionCode"
          clearable
        >
          <el-select
            v-model="dialog.form.regionCode"
            collapse-tags
            placeholder="请选择区域"
            @change="regionChange"
          >
            <el-option
              v-for="(item, index) in regions"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          :label-width="'80px'"
          prop="deptCode"
          class="deptCode"
          clearable
        >
          <el-select
            v-model="dialog.form.deptCode"
            collapse-tags
            filterable
            placeholder="请选择部门"
          >
            <el-option
              v-for="(item, index) in regionDepartments"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          :label-width="'80px'"
          prop="addType"
          class="addType"
          clearable
        >
          <el-select
            v-model="dialog.form.addType"
            collapse-tags
            filterable
            placeholder="请选择盘点类型"
          >
            <el-option
              v-for="(item, index) in addTypes"
              :key="index"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          label-width="80"
          class="product-numbers"
          prop="productNum"
        >
          <el-input
            v-model="dialog.form.productNum"
            placeholder="请输入物资数"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="generateCheckTask">生成</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sendCheckTaskAfterCreated"
            >推送</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="dialog.table.data"
        stripe
        :cell-style="cellStyleFunc"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="deptName" label="项目" width="180">
        </el-table-column>
        <el-table-column prop="checkNo" label="盘点单号" width="180">
          <template slot-scope="scope">
            <a
              href="javascript:void(0);"
              @click="
                $router.push({
                  path: '/checkManagement/checkTaskDt',
                  query: { checkNo: scope.row.checkNo }
                })
              "
              >{{ scope.row.checkNo }}</a
            >
          </template>
        </el-table-column>

        <el-table-column prop="creatorName" label="创建人名称">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { Message, ColorPicker } from 'element-ui';
import messages from '@/utils/messages';
import Big from 'big.js';
import { tableToExcel } from '@/utils/cmn';
import { getKpiInfo } from '@/api/yuebao/kpiBase';
import {
  addCheckNo,
  findCheckNo,
  sendCheckNo,
  deleteCheckNo
} from '@/api/checktask/checktask';
const _ = require('lodash');
export default {
  name: 'checkTask',
  data() {
    return {
      popoverVisible: false,
      regions: [],
      addTypes: [
        { text: '按物资盘点', value: 1 },
        { text: '按箱号盘点', value: 2 }
      ],
      dialog: {
        visible: false,
        title: '创建盘点任务',
        form: {
          regionCode: '',
          deptCode: '',
          productNum: 1,
          addType: 1
        },

        rules: {
          productNum: [
            {
              trigger: 'change',
              message: '请输入大于0数字',
              validator: (rule, value, callback) => {
                const reg = /^[1-9]\d{0,10}$/;
                if (!value) {
                  return callback(new Error('请输入储位数'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('请输入大于0数字'));
                }
                return callback();
              }
            }
          ],
          deptCode: [
            { required: true, message: '请选择项目', trigger: 'change' }
          ]
        },
        table: {
          data: []
        }
      },
      regionDepartments: [],
      sendPopoverVisible: false,
      dialogCreateCheckTaskVisible: false,
      currentPage: 1,
      tables: {
        tableMaxHeight: document.body.clientHeight - 270,
        checkTaskData: [],
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
      checkStatus: [
        { label: '未推送', value: '0' },
        { label: '已推送', value: '1' },
        { label: '已完成', value: '2' },
        { label: '未完成', value: '3' }
      ],
      isSameArray: [
        { label: '否', value: '0' },
        { label: '是', value: '1' }
      ],
      searchForm: {
        deptCode: '',
        checkStatus: '',
        isSame: '',
        searchDate: [],
        creator: ''
      },
      form: {
        id: 0,
        kCode: '',
        kName: '',
        kValue: '',
        unit: '',
        cValue: '',
        kResult: '',
        deptCode: '',
        remark: ''
      }
    };
  },
  computed: {
    deptCode() {
      return this.$store.getters.deptCode;
    },
    userDepartments() {
      return this.$store.getters.userDepartments;
    },
    regionCode() {
      return this.$store.getters.regionCode;
    }
  },
  watch: {
    deptCode(newVal, oldVal) {
      //this.searchFormMethod(1);
    }
  },
  methods: {
    addCheckTaskMethod() {
      this.dialog.table.data = [];
      this.dialog.visible = true;
      this.dialog.title = '创建盘点任务';
      //this.resetForm("forms");
    },
    searchFormMethod(currentPage) {
      if (currentPage) {
        this.tables.postParams.currentPage = currentPage;
      }
      findCheckNo({
        checkNo: '',
        creator: this.searchForm.creator,
        area: this.regionCode,
        deptCode: this.deptCode, //this.deptCode,
        checkStatus: this.searchForm.checkStatus,
        isSame: this.searchForm.isSame,
        orderProp: this.tables.postParams.orderProp,
        orderDirection: this.tables.postParams.orderDirection,
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
              for (let item of res.data.data) {
                if (item.isSame && item.isSame != 'False') {
                  item.isSame = '是';
                } else {
                  item.isSame = '否';
                }
                // let kcQty = new Big(item.kcQty||0);
                // item.kcQty = parseFloat(kcQty.toFixed(2));
                // let checkQty = new Big(item.checkQty||0);
                // item.checkQty = parseFloat(checkQty.toFixed(2));
                // let difQty = new Big(item.difQty||0);
                // item.difQty = parseFloat(difQty.toFixed(2));
                // console.log(item.checkStatus);
                // console.dir(this.checkStatus);
                item.checkStatus = this.checkStatus[item.checkStatus - 0].label;
                if (!item.createDate) {
                  item.createDate = '';
                }
                if (!item.sendDate) {
                  item.sendDate = '';
                }
                if (item.createDate == '1900/1/1 0:00:00') {
                  item.createDate = '';
                }
                if (item.sendDate == '1900/1/1 0:00:00') {
                  item.sendDate = '';
                }
              }
            }
            this.tables.checkTaskData = res.data.data;
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
    exportCheckList() {
      findCheckNo({
        checkNo: '',
        creator: this.searchForm.creator,
        area: this.regionCode,
        deptCode: this.deptCode, //this.deptCode,
        checkStatus: this.searchForm.checkStatus,
        isSame: this.searchForm.isSame,
        orderProp: this.tables.postParams.orderProp,
        orderDirection: this.tables.postParams.orderDirection,
        beginTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[0]
          : '',
        endTime: this.searchForm.searchDate.length
          ? this.searchForm.searchDate[1]
          : '',
        pageSize: 10000,
        pageIndex: 1
      })
        .then(res => {
          if (res.data.resultCode == 1) {
            //遍历数组
            if (res.data.data.length) {
              for (let item of res.data.data) {
                if (item.isSame && item.isSame != 'False') {
                  item.isSame = '是';
                } else {
                  item.isSame = '否';
                }
                if (!item.createDate) {
                  item.createDate = '';
                }
                if (!item.sendDate) {
                  item.sendDate = '';
                }
                // let kcQty = new Big(item.kcQty||0);
                // item.kcQty = parseFloat(kcQty.toFixed(2));
                // let checkQty = new Big(item.checkQty||0);
                // item.checkQty = parseFloat(checkQty.toFixed(2));
                // let difQty = new Big(item.difQty||0);
                // item.difQty = parseFloat(difQty.toFixed(2));
                // console.log(item.checkStatus);
                // console.dir(this.checkStatus);
                item.checkStatus = this.checkStatus[item.checkStatus - 0].label;
                if (item.createDate == '1900/1/1 0:00:00') {
                  item.createDate = '';
                }
                if (item.sendDate == '1900/1/1 0:00:00') {
                  item.sendDate = '';
                }
              }
              let data = res.data.data;
              let cols =
                '盘点单号,区域部门,账实一致,盘点状态,创建人,创建时间,推送时间';
              tableToExcel(data, cols);
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
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    currentPageChange(currentPageNum) {
      this.searchFormMethod(currentPageNum);
    },
    regionChange(region) {
      //根据区域联动部门
      if (!this.userDepartments) {
        this.regionDepartments = [];
      }
      this.regionDepartments = this.userDepartments.filter(c => {
        return c.provinceCode == region;
      });
      //this.regionDepartments.unshift({value:"all",label:"全部"});
      //选中该区域部门第一项
      //console.dir(this.regionDepartments)
      if (this.regionDepartments.length) {
        this.dialog.form.deptCode = this.regionDepartments[0].deptCode;
        //console.log(this.form.deptCode)
      } else {
        this.dialog.form.deptCode = '';
      }
    },
    generateCheckTask() {
      this.$refs['createCheckForm'].validate(valid => {
        if (!valid) {
          return false;
        } else {
          addCheckNo({
            area: this.dialog.form.regionCode,
            addType: this.dialog.form.addType,
            deptCode: this.dialog.form.deptCode,
            productNum: this.dialog.form.productNum
          })
            .then(res => {
              if (res.data.resultCode == 1) {
                // for(let item of res.data.data){
                //   let kcQty = new Big(item.kcQty||0);
                //   item.kcQty = parseFloat(kcQty.toFixed(2));
                // }
                this.dialog.table.data = res.data.data;
                //生成成功后更新盘点列表
                this.searchFormMethod();
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
        }
      });
    },
    sendCheckTask(checkNos) {
      if (Object.prototype.toString.call(checkNos) == '[object Array]') {
        for (let checkNo of checkNos) {
          var checkTaskData = this.getCheckTaskInfo(checkNo);
          if (checkTaskData) {
            if (checkTaskData.checkStatus != '未推送') {
              Message({
                message: '已推送的盘点任务不能重复推送，请重新选择',
                type: 'error',
                duration: 3 * 1000
              });
              return;
            }
          }
        }
      }

      sendCheckNo(checkNos)
        .then(res => {
          if (res.data.resultCode == 1) {
            Message({
              message: '推送成功',
              type: 'success',
              duration: 3 * 1000
            });
            //推送成功后的处理
            this.sendPopoverVisible = false;
            this.searchFormMethod();
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
            duration: 2 * 1000
          });
        });
    },
    sendCheckTaskAfterCreated() {
      //获取需要推送的盘点单号
      var checkNos = [];
      for (let item of this.dialog.table.data) {
        checkNos.push(item.checkNo);
      }
      if (checkNos.length == 0) {
        //没数据时提示
        Message({
          message: '请先生成盘点任务单',
          type: 'warning',
          duration: 2 * 1000
        });
        return;
      }
      this.sendCheckTask(checkNos);
    },
    batchDeleteFunc() {
      let checkNos = [];
      //批量删除
      if (this.tables.multipleSelection.length !== 0) {
        checkNos = this.tables.multipleSelection.map(v => {
          return v.checkNo;
        });
      }
      if (!checkNos.length) {
        Message({
          message: '请选择需要删除的盘点任务',
          type: 'warning',
          duration: 3 * 1000
        });
        this.popoverVisible = false;
        return;
      }
      this.deleteCheckTask(checkNos);
    },
    batchSendFunc() {
      let checkNos = [];
      //批量删除
      if (this.tables.multipleSelection.length !== 0) {
        checkNos = this.tables.multipleSelection.map(v => {
          return v.checkNo;
        });
      }
      if (!checkNos.length) {
        this.sendPopoverVisible = false;
        Message({
          message: '请选择需要推送的盘点任务',
          type: 'warning',
          duration: 3 * 1000
        });
        return;
      }
      this.sendCheckTask(checkNos);
    },
    getCheckTaskInfo(checkNo) {
      for (let item of this.tables.checkTaskData) {
        if (item.checkNo == checkNo) {
          return item;
        }
      }
      return null;
    },
    deleteCheckTask(checkNos, row) {
      //过滤不能删除的checkNo
      if (Object.prototype.toString.call(checkNos) == '[object Array]') {
        for (let checkNo of checkNos) {
          var checkTaskData = this.getCheckTaskInfo(checkNo);
          if (checkTaskData) {
            if (
              checkTaskData.checkStatus == '已完成' ||
              checkTaskData.checkStatus == '未完成'
            ) {
              Message({
                message: '已结束的盘点任务无法删除，请重新选择',
                type: 'error',
                duration: 3 * 1000
              });
              return;
            }
          }
        }
      }
      deleteCheckNo(checkNos)
        .then(res => {
          if (res.data.resultCode == 1) {
            Message({
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            });
            //删除成功后的处理
            if (row) {
              row.visible = false;
            }
            this.popoverVisible = false;
            this.searchFormMethod();
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
            duration: 2 * 1000
          });
        });
    },
    deleteCheckTaskBtnFunc(row) {
      this.deleteCheckTask([row.checkNo], row);
    },
    sendCheckTaskBtnFunc(row) {
      this.sendCheckTask([row.checkNo]);
    },
    // cellStyleFunc (obj) {
    //   if(obj.columnIndex === 9){
    //     if(obj.row.isSame=="否"){

    //       return 'color:red'
    //     }else{
    //       return ''; //'color:#606266'
    //     }
    //   }
    //   else if(obj.columnIndex === 8){
    //     if(obj.row.checkStatus==="未完成"){
    //       return 'color:red';
    //     }else{
    //       return ''
    //     }
    //   }
    //   else{
    //       return ''
    //   }
    // },
    cellStyleFunc(obj) {
      if (obj.columnIndex === 2) {
        return 'color:#409EFF';
      } else {
        return '';
      }
    },
    sortChangeFunc(obj) {
      this.tables.postParams.orderDirection = obj.order;
      this.tables.postParams.orderProp = obj.prop;
      this.searchFormMethod(1);
    },
    dialogOpen() {
      this.dialog.visible = true;
      this.regions = _.uniqBy(this.userDepartments, 'provinceCode').map(c => {
        return { provinceCode: c.provinceCode, provinceName: c.provinceName };
      });
      this.regions.sort();
      if (this.$store.getters.regionCode) {
        //查询缓存中的是否在区域列表中，如果不是的话就显示第一条
        let r = this.regions.filter(c => {
          return c.provinceCode == this.$store.getters.regionCode;
        });
        if (r && r.length) {
          this.regionCode = this.$store.getters.regionCode;
        } else {
          this.regionCode = this.regions[0].provinceCode;
        }
      } else {
        if (this.regions.length) {
          this.regionCode = this.regions[0].provinceCode;
        }
      }
      this.regionChange(this.regionCode);
    },
    dialogClose() {
      this.dialog.visible = false;
    }
  },
  mounted() {
    //this.searchFormMethod(1);
  },
  created() {
    //this.searchFormMethod(1);
    //console.dir(this.$util.pickerOptions);
    // console.log(parseTime);
  }
};
</script>

<style lang="scss" scoped></style>
