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
        <el-form-item v-show="true" prop="costId">
          <el-input
            v-model="searchForm.costId"
            placeholder="请输入唯一编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="priceName">
          <el-input
            v-model="searchForm.priceName"
            placeholder="请输入成本价格表名称"
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

        <el-form-item v-show="true" prop="sendProvinceId">
          <el-select
            v-model="searchForm.sendProvinceId"
            filterable
            placeholder="请选择始发省"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.provinces"
              :value-key="item.provinceId"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="sendCityId">
          <el-select
            v-model="searchForm.sendCityId"
            filterable
            placeholder="请选择始发市"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.sendCityId"
              :value-key="item.cityId"
              :key="index"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="receiveProvinceId">
          <el-select
            v-model="searchForm.receiveProvinceId"
            filterable
            placeholder="请选择目的省"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.provinces"
              :value-key="item.provinceId"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-show="true" prop="receiveCityId">
          <el-select
            v-model="searchForm.receiveCityId"
            filterable
            placeholder="请选择目的地市"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.receiveCityId"
              :value-key="item.cityId"
              :key="index"
              :label="item.cityName"
              :value="item.cityId"
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
            @click="handleGenSalesPriceBtnClickFunc()"
            ><i class="iconfont el-icon-s-promotion"></i>生成销售价格</el-button
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
        prop="priceName"
        label="成本价格表名称"
        width="120"
        fixed
      ></el-table-column>

      <el-table-column
        prop="fleetName"
        label="承运商名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="checkStateDesc"
        label="审核状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="areaTypeDesc"
        label="区域类型"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="sendProvinceName"
        label="始发省名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="sendCityName"
        label="始发市名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="receiveProvinceName"
        label="目的省名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="receiveCityName"
        label="目的地市名称"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="direction"
        label="流向"
        width="120"
      ></el-table-column>

      <el-table-column prop="effectMinTime" label="预计最少天数" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.effectMinTime">
            <span class="col-content">{{ scope.row.effectMinTime }}</span
            ><span class="col-suffix">{{ '天' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="effectMaxTime" label="预计最多天数" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.effectMaxTime">
            <span class="col-content">{{ scope.row.effectMaxTime }}</span
            ><span class="col-suffix">{{ '天' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="firstHeavy" label="首重" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.firstHeavy">
            <span class="col-content">{{ scope.row.firstHeavy }}</span
            ><span class="col-suffix">{{ 'kg' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="firstTaxPrice"
        label="首重价格（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.firstTaxPrice">
            <span class="col-content">{{ scope.row.firstTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="firstPrice" label="首重价格（不含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.firstPrice">
            <span class="col-content">{{ scope.row.firstPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="reletTaxPrice"
        label="续重价格（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.reletTaxPrice">
            <span class="col-content">{{ scope.row.reletTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="reletPrice" label="续重价格（不含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.reletPrice">
            <span class="col-content">{{ scope.row.reletPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="protectedPriceRate"
        label="价保费率"
        width="120"
      ></el-table-column>

      <el-table-column prop="tax" label="税率" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.tax">
            <span class="col-content">{{ scope.row.tax }}</span
            ><span class="col-suffix">{{ '%' }}</span>
          </span>
        </template>
      </el-table-column>

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
        label-width="150px"
        :inline="true"
        label-position="right"
        size="small"
      >
        <el-form-item label="唯一编号" v-show="false" prop="costId">
          <el-input
            v-model="addForm.data.costId"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="成本价格表名称" v-show="true" prop="priceName">
          <el-input
            v-model="addForm.data.priceName"
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

        <el-form-item label="始发省" v-show="true" prop="sendProvinceId">
          <el-select
            v-model="addForm.data.sendProvinceId"
            filterable
            placeholder="请选择始发省"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.provinces"
              :value-key="item.provinceId"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="始发省名称" v-show="false" prop="sendProvinceName">
          <el-input
            v-model="addForm.data.sendProvinceName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="始发市" v-show="true" prop="sendCityId">
          <el-select
            v-model="addForm.data.sendCityId"
            filterable
            placeholder="请选择始发市"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.sendCityIdAdd"
              :value-key="item.cityId"
              :key="index"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="始发市名称" v-show="false" prop="sendCityName">
          <el-input
            v-model="addForm.data.sendCityName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="目的省" v-show="true" prop="receiveProvinceId">
          <el-select
            v-model="addForm.data.receiveProvinceId"
            filterable
            placeholder="请选择目的省"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.provinces"
              :value-key="item.provinceId"
              :key="index"
              :label="item.provinceName"
              :value="item.provinceId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="目的省名称"
          v-show="false"
          prop="receiveProvinceName"
        >
          <el-input
            v-model="addForm.data.receiveProvinceName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="目的地市" v-show="true" prop="receiveCityId">
          <el-select
            v-model="addForm.data.receiveCityId"
            filterable
            placeholder="请选择目的地市"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.receiveCityIdAdd"
              :value-key="item.cityId"
              :key="index"
              :label="item.cityName"
              :value="item.cityId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="目的地市名称"
          v-show="false"
          prop="receiveCityName"
        >
          <el-input
            v-model="addForm.data.receiveCityName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="流向" v-show="true" prop="direction">
          <el-select
            v-model="addForm.data.direction"
            filterable
            placeholder="请选择流向"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.direction"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="区域类型" v-show="true" prop="areaType">
          <el-select
            v-model="addForm.data.areaType"
            filterable
            placeholder="请选择区域类型"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.areaType"
              :value-key="item.value"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预计最少天数" v-show="true" prop="effectMinTime">
          <el-input
            v-model="addForm.data.effectMinTime"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">天</i>
          </el-input>
        </el-form-item>

        <el-form-item label="预计最多天数" v-show="true" prop="effectMaxTime">
          <el-input
            v-model="addForm.data.effectMaxTime"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">天</i>
          </el-input>
        </el-form-item>

        <el-form-item label="首重" v-show="true" prop="firstHeavy">
          <el-input
            v-model="addForm.data.firstHeavy"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">kg</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="首重价格（含税）"
          v-show="true"
          prop="firstTaxPrice"
        >
          <el-input
            v-model="addForm.data.firstTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="首重价格（不含税）"
          v-show="true"
          prop="firstPrice"
        >
          <el-input
            v-model="addForm.data.firstPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="续重价格（含税）"
          v-show="true"
          prop="reletTaxPrice"
        >
          <el-input
            v-model="addForm.data.reletTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="续重价格（不含税）"
          v-show="true"
          prop="reletPrice"
        >
          <el-input
            v-model="addForm.data.reletPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="价保费率" v-show="true" prop="protectedPriceRate">
          <el-input
            v-model="addForm.data.protectedPriceRate"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="税率" v-show="true" prop="tax">
          <el-input
            v-model="addForm.data.tax"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">%</i>
          </el-input>
        </el-form-item>

        <el-form-item label="起始有效期" v-show="true" prop="startDate">
          <el-date-picker
            v-model="addForm.data.startDate"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            placeholder="选择起始有效期"
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

        <el-form-item label="备注" v-show="true" prop="remark">
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

    <GenerateSalesPrice
      ref="genSalesPrice"
      :initialCostPrice="20"
      v-on:okBtnClick="handleGenSales"
    ></GenerateSalesPrice>
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
  getCpriceKd,
  addCpriceKd,
  upCpriceKd,
  delCpriceKd,
  auditCpriceKd,
  addQueueList,
  addAreaList,
  addSpriceKd,
  getFleetList
} from '@/api/WoMallManagement/express-cost-price';

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
        title: '快递线路成本价格',
        visible: false
      },
      selectArr: {
        carrier: [],

        provinces: [],

        sendCityId: [],

        receiveCityId: [],

        sendCityIdAdd: [],

        receiveCityIdAdd: [],

        direction: [],

        areaType: [
          { value: '0', label: '同城' },
          { value: '1', label: '省内' },
          { value: '2', label: '省外' }
        ],

        checkState: [
          { value: '0', label: '未审核' },
          { value: '1', label: '已审核' }
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
        costId: '',
        priceName: '',
        fleetId: '',
        sendProvinceId: '',
        sendCityId: '',
        receiveProvinceId: '',
        receiveCityId: ''
      },
      addForm: {
        data: {
          costId: '',
          priceName: '',
          fleetId: '',
          fleetName: '',
          sendProvinceId: '',
          sendProvinceName: '',
          sendCityId: '',
          sendCityName: '',
          receiveProvinceId: '',
          receiveProvinceName: '',
          receiveCityId: '',
          receiveCityName: '',
          direction: '',
          areaType: '',
          effectMinTime: '',
          effectMaxTime: null,
          firstHeavy: '',
          firstTaxPrice: '',
          firstPrice: '',
          reletTaxPrice: '',
          reletPrice: '',
          protectedPriceRate: '',
          tax: '',
          startDate: '',
          endDate: '',
          checkState: '0',
          remark: ''
        },
        config: {
          disabled: false
        },
        rules: {
          costId: [],

          priceName: [
            {
              required: true,
              trigger: 'blur',
              message: '成本价格表名称不能为空'
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

          sendProvinceId: [
            {
              required: true,
              trigger: 'blur',
              message: '始发省不能为空'
            }
          ],

          sendProvinceName: [],

          sendCityId: [
            {
              required: true,
              trigger: 'blur',
              message: '始发市不能为空'
            }
          ],

          sendCityName: [],

          receiveProvinceId: [
            {
              required: true,
              trigger: 'blur',
              message: '目的省不能为空'
            }
          ],

          receiveProvinceName: [],

          receiveCityId: [
            {
              required: true,
              trigger: 'blur',
              message: '目的地市不能为空'
            }
          ],

          receiveCityName: [],

          direction: [
            {
              required: true,
              trigger: 'blur',
              message: '流向不能为空'
            }
          ],

          areaType: [
            {
              required: true,
              trigger: 'blur',
              message: '区域类型不能为空'
            }
          ],

          effectMinTime: [
            {
              required: true,
              trigger: 'blur',
              message: '预计最少天数不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          effectMaxTime: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          firstHeavy: [
            {
              required: true,
              trigger: 'blur',
              message: '首重不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          firstTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '首重价格（含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          firstPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '首重价格（不含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          reletTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '续重价格（含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          reletPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '续重价格（不含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          protectedPriceRate: [
            {
              required: true,
              trigger: 'blur',
              message: '价保费率不能为空'
            }
          ],

          tax: [
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
              message: '起始有效期不能为空'
            }
          ],

          endDate: [
            {
              required: true,
              trigger: 'blur',
              message: '结束有效期不能为空'
            }
          ],

          checkState: [
            {
              required: true,
              trigger: 'blur',
              message: '审核状态不能为空'
            }
          ],

          remark: []
        }
      },
      name: 'nihao'
    };
  },
  components: {
    GenerateSalesPrice
  },
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
        return c.costId;
      });
    }
  },
  metas: {
    title: '快递线路成本价格',
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
      getCpriceKd(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '成本价格表名称,承运商名称,审核状态,区域类型,始发省名称,始发市名称,目的省名称,目的地市名称,流向,预计最少天数,预计最多天数,首重,首重价格（含税）,首重价格（不含税）,续重价格（含税）,续重价格（不含税）,价保费率,税率,起始有效期,结束有效期,备注,创建时间,修改时间,操作人';
            let fields =
              'priceName,fleetName,checkStateDesc,areaTypeDesc,sendProvinceName,sendCityName,receiveProvinceName,receiveCityName,direction,effectMinTime,effectMaxTime,firstHeavy,firstTaxPrice,firstPrice,reletTaxPrice,reletPrice,protectedPriceRate,tax,startDate,endDate,remark,addDate,editDate,operatorId';
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
      getCpriceKd(
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
                !isNaN(item.effectMinTime) &&
                item.effectMinTime !== '' &&
                item.effectMinTime !== null
              ) {
                let effectMinTime = new Big(item.effectMinTime || 0);
                item.effectMinTime = parseFloat(effectMinTime.toFixed(2));
              }

              if (
                !isNaN(item.effectMaxTime) &&
                item.effectMaxTime !== '' &&
                item.effectMaxTime !== null
              ) {
                let effectMaxTime = new Big(item.effectMaxTime || 0);
                item.effectMaxTime = parseFloat(effectMaxTime.toFixed(2));
              }

              if (
                !isNaN(item.firstHeavy) &&
                item.firstHeavy !== '' &&
                item.firstHeavy !== null
              ) {
                let firstHeavy = new Big(item.firstHeavy || 0);
                item.firstHeavy = parseFloat(firstHeavy.toFixed(3));
              }

              if (
                !isNaN(item.firstTaxPrice) &&
                item.firstTaxPrice !== '' &&
                item.firstTaxPrice !== null
              ) {
                let firstTaxPrice = new Big(item.firstTaxPrice || 0);
                item.firstTaxPrice = parseFloat(firstTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.firstPrice) &&
                item.firstPrice !== '' &&
                item.firstPrice !== null
              ) {
                let firstPrice = new Big(item.firstPrice || 0);
                item.firstPrice = parseFloat(firstPrice.toFixed(4));
              }

              if (
                !isNaN(item.reletTaxPrice) &&
                item.reletTaxPrice !== '' &&
                item.reletTaxPrice !== null
              ) {
                let reletTaxPrice = new Big(item.reletTaxPrice || 0);
                item.reletTaxPrice = parseFloat(reletTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.reletPrice) &&
                item.reletPrice !== '' &&
                item.reletPrice !== null
              ) {
                let reletPrice = new Big(item.reletPrice || 0);
                item.reletPrice = parseFloat(reletPrice.toFixed(4));
              }

              if (!isNaN(item.tax) && item.tax !== '' && item.tax !== null) {
                let tax = new Big(item.tax || 0);
                item.tax = parseFloat(tax.times(100).toFixed(2));
              }
            }
            this.tables.tableData = data;
            if (needSaveSelect) {
              for (let item of this.multipleSelection) {
                let obj = _.find(this.tables.tableData, {
                  costId: item.costId
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
      this.dialog.title = '新增快递线路成本价格';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addCpriceKd(data).then(res => {
        if (res.data.resultCode === 1) {
          // this.dialogTableVisible = false;
          this.searchFormMethod();
          this.addForm.data.costId = res.data.data;
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
      delCpriceKd(this.selectIds)
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
        costIds: this.selectIds
      };
      auditCpriceKd(data)
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
      upCpriceKd(data).then(res => {
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
      this.dialog.title = '编辑快递线路成本价格';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.costId = row.costId;

      getCpriceKd({
        costId: row.costId || -1
      }).then(res => {
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          for (let item of data) {
            if (
              !isNaN(item.effectMinTime) &&
              item.effectMinTime !== '' &&
              item.effectMinTime !== null
            ) {
              let effectMinTime = new Big(item.effectMinTime || 0);
              item.effectMinTime = parseFloat(effectMinTime.toFixed(2));
            }

            if (
              !isNaN(item.effectMaxTime) &&
              item.effectMaxTime !== '' &&
              item.effectMaxTime !== null
            ) {
              let effectMaxTime = new Big(item.effectMaxTime || 0);
              item.effectMaxTime = parseFloat(effectMaxTime.toFixed(2));
            }

            if (
              !isNaN(item.firstHeavy) &&
              item.firstHeavy !== '' &&
              item.firstHeavy !== null
            ) {
              let firstHeavy = new Big(item.firstHeavy || 0);
              item.firstHeavy = parseFloat(firstHeavy.toFixed(3));
            }

            if (
              !isNaN(item.firstTaxPrice) &&
              item.firstTaxPrice !== '' &&
              item.firstTaxPrice !== null
            ) {
              let firstTaxPrice = new Big(item.firstTaxPrice || 0);
              item.firstTaxPrice = parseFloat(firstTaxPrice.toFixed(4));
            }

            if (
              !isNaN(item.firstPrice) &&
              item.firstPrice !== '' &&
              item.firstPrice !== null
            ) {
              let firstPrice = new Big(item.firstPrice || 0);
              item.firstPrice = parseFloat(firstPrice.toFixed(4));
            }

            if (
              !isNaN(item.reletTaxPrice) &&
              item.reletTaxPrice !== '' &&
              item.reletTaxPrice !== null
            ) {
              let reletTaxPrice = new Big(item.reletTaxPrice || 0);
              item.reletTaxPrice = parseFloat(reletTaxPrice.toFixed(4));
            }

            if (
              !isNaN(item.reletPrice) &&
              item.reletPrice !== '' &&
              item.reletPrice !== null
            ) {
              let reletPrice = new Big(item.reletPrice || 0);
              item.reletPrice = parseFloat(reletPrice.toFixed(4));
            }

            if (!isNaN(item.tax) && item.tax !== '' && item.tax !== null) {
              let tax = new Big(item.tax || 0);
              item.tax = parseFloat(tax.times(100).toFixed(2));
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

    handleGenSalesPriceBtnClickFunc() {
      this.openGenSalesDialog();
    },

    openGenSalesDialog(a, b) {
      if (!(this.selectIds && this.selectIds.length)) {
        return Message({
          message: '请至少选择一行数据',
          type: 'error',
          duration: 3 * 1000
        });
      }
      this.$refs.genSalesPrice.show();
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
    getAddressData() {
      let data = { pageindex: 1, pageSize: 10000 };
      getAreaList(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            this.addressData = res.data.data;
            this.setProvinces();
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
      addSpriceKd(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            return Message({
              message: '生成成功',
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

          if (data.tax) {
            let tax = new Big(data.tax || 0);
            data.tax = parseFloat(tax.div(100).toFixed(4));
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
  activated() {
    this.getAddressData();
    this.getFleetData();
  },
  mounted() {
    this.setTableMaxHeight();

    this.getAddressData();
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
