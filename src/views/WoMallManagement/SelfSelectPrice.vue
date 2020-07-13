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
        <el-form-item v-show="true" prop="priceId">
          <el-input
            v-model="searchForm.priceId"
            placeholder="请输入唯一编号"
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

        <el-form-item v-show="true" prop="checkState">
          <el-select
            v-model="searchForm.checkState"
            filterable
            placeholder="请选择审核状态"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.checkState"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="operationType">
          <el-select
            v-model="searchForm.operationType"
            filterable
            placeholder="请选择推送操作"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.operationType"
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
      <el-form :inline="true">
        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handleCreateBtnClickFunc()"
            ><i class="el-icon-circle-plus-outline"></i>新增</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-popover
            placement="bottom"
            width="160"
            v-model="popoverVisible.batchDelBtn"
          >
            <p>{{ '是否确定删除？' }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="popoverVisible.batchDelBtn = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleBatchDelBtnClickFunc()"
                >确定</el-button
              >
            </div>
            <el-button type="danger" size="small" slot="reference"
              ><i class="iconfont icon-shanchu"></i>批量删除</el-button
            >
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-popover
            placement="bottom"
            width="160"
            v-model="popoverVisible.batchApprovalBtn"
          >
            <p>{{ '是否继续审核？' }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="popoverVisible.batchApprovalBtn = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleBatchApprovalBtnClickFunc()"
                >确定</el-button
              >
            </div>
            <el-button type="primary" size="small" slot="reference"
              ><i class="iconfont el-icon-download"></i>批量审核</el-button
            >
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-popover
            placement="bottom"
            width="160"
            v-model="popoverVisible.batchReApprovalBtn"
          >
            <p>{{ '是否继续反审核？' }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="popoverVisible.batchReApprovalBtn = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handleBatchReApprovalBtnClickFunc()"
                >确定</el-button
              >
            </div>
            <el-button type="warning" size="small" slot="reference"
              ><i class="iconfont el-icon-upload2"></i>批量反审核</el-button
            >
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            size="small"
            @click="handlePushMallPriceBtnClickFunc()"
            ><i class="iconfont el-icon-upload"></i>推送更新商城价格</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            size="small"
            @click="handleDelMallPriceBtnClickFunc()"
            ><i class="iconfont el-icon-delete"></i>推送删除商城价格</el-button
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
        label="送仓费费单位"
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

      <el-table-column
        prop="startDate"
        label=" 起始有效期"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="endDate"
        label=" 结束有效期"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="checkStateDesc"
        label=" 状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="pushStateDesc"
        label="推送审核状态"
        width="120"
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

      <el-table-column
        prop="remark"
        label=" 备注"
        width="200"
      ></el-table-column>

      <el-table-column width="120" label="操作" fixed="right">
        <template slot-scope="caozuo">
          <el-button size="mini" @click="handleEditBtnClickFunc(caozuo.row)"
            ><i class="iconfont icon-bj"></i>编辑</el-button
          >
        </template>
      </el-table-column>
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

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="1100px"
      :close-on-click-modal="false"
      v-dialogDrag
      v-dialogDragWidth
      @closed="addEditDialogCloseFunc"
    >
      <el-form
        :model="addForm.data"
        ref="addFormRef"
        status-icon
        :rules="addForm.rules"
        label-width="170px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="唯一编号" v-show="false" prop="priceId">
          <el-input
            v-model="addForm.data.priceId"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="申请单号" v-show="true" prop="applyNO">
          <el-input
            v-model="addForm.data.applyNO"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="承运商" v-show="true" prop="fleetId">
          <el-select
            v-model="addForm.data.fleetId"
            filterable
            placeholder="请选择承运商"
            style="width:165px"
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

        <el-form-item label="承运商名称" v-show="false" prop="fleetName">
          <el-input
            v-model="addForm.data.fleetName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="装卸费成本（含税）"
          v-show="true"
          prop="loadCTaxPrice"
        >
          <el-input
            v-model="addForm.data.loadCTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="装卸费销售（含税）"
          v-show="true"
          prop="loadTaxPrice"
        >
          <el-input
            v-model="addForm.data.loadTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="装卸费成本（不含税）"
          v-show="true"
          prop="loadCPrice"
        >
          <el-input
            v-model="addForm.data.loadCPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="装卸费销售（不含税）"
          v-show="true"
          prop="loadPrice"
        >
          <el-input
            v-model="addForm.data.loadPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="装卸费单位" v-show="true" prop="loadPriceUnit">
          <el-select
            v-model="addForm.data.loadPriceUnit"
            filterable
            placeholder="请选择装卸费单位"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.loadPriceUnit"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="送仓费成本(含税)"
          v-show="true"
          prop="stockCTaxPrice"
        >
          <el-input
            v-model="addForm.data.stockCTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="送仓费销售(含税)"
          v-show="true"
          prop="stockTaxPrice"
        >
          <el-input
            v-model="addForm.data.stockTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="送仓费成本(不含税)"
          v-show="true"
          prop="stockCPrice"
        >
          <el-input
            v-model="addForm.data.stockCPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="送仓费销售(不含税)"
          v-show="true"
          prop="stockPrice"
        >
          <el-input
            v-model="addForm.data.stockPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="送仓费费单位" v-show="true" prop="stockPriceUnit">
          <el-select
            v-model="addForm.data.stockPriceUnit"
            filterable
            placeholder="请选择送仓费费单位"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.stockPriceUnit"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="税率" v-show="true" prop="taxRate">
          <el-input
            v-model="addForm.data.taxRate"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">%</i>
          </el-input>
        </el-form-item>

        <el-form-item label=" 起始有效期" v-show="true" prop="startDate">
          <el-date-picker
            v-model="addForm.data.startDate"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            placeholder="选择 起始有效期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束有效期" v-show="true" prop="endDate">
          <el-date-picker
            v-model="addForm.data.endDate"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            placeholder="选择结束有效期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="审核状态" v-show="true" prop="checkState">
          <el-select
            v-model="addForm.data.checkState"
            filterable
            placeholder="请选择审核状态"
            disabled
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.checkState"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="推送操作" v-show="true" prop="operationType">
          <el-select
            v-model="addForm.data.operationType"
            filterable
            placeholder="请选择推送操作"
            disabled
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.operationType"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="推送审核状态" v-show="true" prop="pushState">
          <el-select
            v-model="addForm.data.pushState"
            filterable
            placeholder="请选择推送审核状态"
            disabled
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.pushState"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" v-show="true" prop="addDate">
          <el-date-picker
            v-model="addForm.data.addDate"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            disabled
            placeholder="选择创建时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="修改时间" v-show="true" prop="editDate">
          <el-date-picker
            v-model="addForm.data.editDate"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            disabled
            placeholder="选择修改时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="操作人" v-show="true" prop="operatorId">
          <el-input
            v-model="addForm.data.operatorId"
            placeholder=""
            style="width:165px;"
            clearable
            disabled
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label=" 备注" v-show="true" prop="remark">
          <el-input
            v-model="addForm.data.remark"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button v-if="dialog.title=='新增用户'" @click="resetForm('addFormRef')">重置</el-button> -->
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="subAddForm()">确 定</el-button>
      </div>
    </el-dialog>
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
  getPriceZx,
  addPriceZx,
  upPriceZx,
  delPriceZx,
  auditPriceZx,
  addQueueList,
  getFleetList
} from '@/api/WoMallManagement/self-select-price';

import { getAreaList } from '@/api/WoMallManagement/address';
import { GenerateSalesPrice } from '@/components/WoMall';

const _ = require('lodash');

export default {
  data() {
    return {
      popoverVisible: {
        batchDelBtn: false,
        batchApprovalBtn: false,
        batchReApprovalBtn: false
      },
      dialog: {
        title: '用户自选费用价格',
        visible: false
      },
      selectArr: {
        carrier: [],

        checkState: [
          { label: '未审核', value: '0' },
          { label: '已审核', value: '1' }
        ],

        operationType: [
          { label: '新增', value: '0' },
          { label: '更新', value: '1' },
          { label: '删除', value: '2' }
        ],

        loadPriceUnit: [
          { label: '公斤', value: '0' },
          { label: '单', value: '1' }
        ],

        stockPriceUnit: [
          { label: '公斤', value: '0' },
          { label: '单', value: '1' }
        ],

        pushState: [
          { label: '未推送', value: '0' },
          { label: '已推送', value: '1' },
          { label: '已通过', value: '2' },
          { label: '未通过', value: '3' }
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
        priceId: '',
        fleetId: '',
        checkState: '',
        operationType: ''
      },
      addForm: {
        data: {
          priceId: '',
          applyNO: '',
          fleetId: '',
          fleetName: '',
          loadCTaxPrice: '',
          loadTaxPrice: '',
          loadCPrice: '',
          loadPrice: '',
          loadPriceUnit: '',
          stockCTaxPrice: '',
          stockTaxPrice: '',
          stockCPrice: '',
          stockPrice: '',
          stockPriceUnit: '',
          taxRate: '',
          startDate: '',
          endDate: '',
          checkState: '0',
          operationType: '0',
          pushState: '0',
          addDate: '',
          editDate: '',
          operatorId: '',
          remark: ''
        },
        config: {
          disabled: false
        },
        rules: {
          priceId: [],

          applyNO: [
            {
              required: true,
              trigger: 'blur',
              message: '申请单号不能为空'
            }
          ],

          fleetId: [
            {
              required: true,
              trigger: 'blur',
              message: '承运商不能为空'
            }
          ],

          fleetName: [],

          loadCTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '装卸费成本（含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          loadTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '装卸费销售（含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          loadCPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '装卸费成本（不含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          loadPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '装卸费销售（不含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          loadPriceUnit: [
            {
              required: true,
              trigger: 'blur',
              message: '装卸费单位不能为空'
            }
          ],

          stockCTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '送仓费成本(含税)不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          stockTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '送仓费销售(含税)不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          stockCPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '送仓费成本(不含税)不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          stockPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '送仓费销售(不含税)不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          stockPriceUnit: [
            {
              required: true,
              trigger: 'blur',
              message: '送仓费费单位不能为空'
            }
          ],

          taxRate: [
            {
              required: true,
              trigger: 'blur',
              message: '税率不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          startDate: [
            {
              required: true,
              trigger: 'blur',
              message: ' 起始有效期不能为空'
            }
          ],

          endDate: [
            {
              required: true,
              trigger: 'blur',
              message: '结束有效期不能为空'
            }
          ],

          checkState: [],

          operationType: [],

          pushState: [],

          addDate: [],

          editDate: [],

          operatorId: [],

          remark: []
        }
      },
      name: 'nihao'
    };
  },
  components: {},
  watch: {
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
        return c.priceId;
      });
    }
  },
  metas: {
    title: '用户自选费用价格',
    titleTemplate: '%s - 兆航物流TMS后台管理系统',

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
      getPriceZx(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '申请单号,承运商名称,装卸费成本（含税）,装卸费销售（含税）,装卸费成本（不含税）,装卸费销售（不含税）,装卸费单位,送仓费成本(含税),送仓费销售(含税),送仓费成本(不含税),送仓费销售(不含税),送仓费费单位,税率, 起始有效期, 结束有效期, 状态,推送审核状态,创建时间,修改时间,操作人, 备注';
            let fields =
              'applyNO,fleetName,loadCTaxPrice,loadTaxPrice,loadCPrice,loadPrice,loadPriceUnitDesc,stockCTaxPrice,stockTaxPrice,stockCPrice,stockPrice,stockPriceUnitDesc,taxRate,startDate,endDate,checkStateDesc,pushStateDesc,addDate,editDate,operatorId,remark';
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
      getPriceZx(
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
                  priceId: item.priceId
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

    handleCreateBtnClickFunc() {
      this.dialog.visible = true;
      this.dialog.title = '新增用户自选费用价格';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addPriceZx(data).then(res => {
        if (res.data.resultCode === 1) {
          // this.dialogTableVisible = false;
          this.searchFormMethod();
          this.addForm.data.priceId = res.data.data;
          //this.resetAddForm();
          this.dialog.title = '编辑快递线路成本价格';
          this.dialog.status = 1;
          this.addForm.config.disabled = true;
          Message({
            message: '新增成功',
            type: 'success',
            duration: 3 * 1000
          });
        } else {
          Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        }
      });
    },

    handleBatchDelBtnClickFunc() {
      if (!(this.selectIds && this.selectIds.length)) {
        this.popoverVisible.batchDelBtn = false;
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      delPriceZx(this.selectIds)
        .then(res => {
          if (res.data.resultCode === 1) {
            this.searchFormMethod();
            Message({
              message: '操作成功',
              type: 'success',
              duration: 3 * 1000
            });
            this.popoverVisible.batchDelBtn = false;
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

    handleBatchApprovalBtnClickFunc() {
      if (!(this.selectIds && this.selectIds.length)) {
        this.popoverVisible.batchApprovalBtn = false;
        this.popoverVisible.batchReApprovalBtn = false;
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      this.changeAudit(1);
    },
    changeAudit(checkState) {
      let data = {
        checkState: checkState,
        priceIds: this.selectIds
      };
      auditPriceZx(data)
        .then(res => {
          if (res.data.resultCode === 1) {
            // this.dialogTableVisible = false;
            this.searchFormMethod();
            Message({
              message: '操作成功',
              type: 'success',
              duration: 3 * 1000
            });
            this.popoverVisible.batchReApprovalBtn = false;
            this.popoverVisible.batchApprovalBtn = false;
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

    handleBatchReApprovalBtnClickFunc() {
      if (!(this.selectIds && this.selectIds.length)) {
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      this.changeAudit(0);
    },

    submitEditData(data) {
      upPriceZx(data).then(res => {
        if (res.data.resultCode == 1) {
          this.searchFormMethod();
          Message({
            message: '修改成功',
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
      });
    },
    addEditDialogCloseFunc() {
      this.resetForm('addFormRef');
    },
    handleEditBtnClickFunc(row) {
      this.dialog.visible = true;
      this.dialog.title = '编辑用户自选费用价格';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.priceId = row.priceId;

      getPriceZx({
        priceId: row.priceId || -1
      }).then(res => {
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
          if (data.length > 0) {
            data = data[0];
          } else {
            console.log('获取数据失败');
            return;
          }

          this.addForm.data = data;
        }
      });
    },

    sortChangeFunc(obj) {
      this.tables.postParams.orderDirection = obj.order;
      this.tables.postParams.orderProp = obj.prop;
      this.searchFormMethod(1, false);
    },

    handlePushMallPriceBtnClickFunc() {
      this.pushMallPrice();
    },

    handleDelMallPriceBtnClickFunc() {
      this.delMallPrice();
    },

    pushMallPrice(a, b) {
      if (!(this.selectIds && this.selectIds.length)) {
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        interfaceId: '2.6',
        interfaceName: '用户自选费用推送接口',
        paramId: this.selectIds.join(',')
      };
      this.pushMsg(data);
    },

    delMallPrice(a, b) {
      if (!(this.selectIds && this.selectIds.length)) {
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      let data = {
        interfaceId: '2.6',
        interfaceName: '用户自选费用推送接口',
        paramId: this.selectIds.join(',')
      };
      this.pushMsg(data);
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
