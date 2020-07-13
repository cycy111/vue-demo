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
        <el-form-item v-show="false" prop="saleId">
          <el-input
            v-model="searchForm.saleId"
            placeholder="请输入唯一编号"
            style="width:150px;"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item v-show="true" prop="priceName">
          <el-input
            v-model="searchForm.priceName"
            placeholder="请输入销售价格表名称"
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

        <el-form-item>
          <input
            type="file"
            style="display:none"
            ref="uploadInput"
            @change="fileUpload"
          />
          <el-button
            type="primary"
            size="small"
            @click="handleImportBtnClickFunc()"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            size="small"
            @click="handleTemplateBtnClickFunc()"
            >导入模板</el-button
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
        prop="priceName"
        label="零担价格表名称"
        width="200"
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

      <el-table-column
        prop="areaTypeDesc"
        label="区域类型"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="reservedsDesc"
        label="线路说明"
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

      <el-table-column prop="effectMaxTime" label=" 预计最多天数" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.effectMaxTime">
            <span class="col-content">{{ scope.row.effectMaxTime }}</span
            ><span class="col-suffix">{{ '天' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="cMinHeavyTaxPrice"
        label="最低一票成本价格（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.cMinHeavyTaxPrice">
            <span class="col-content">{{ scope.row.cMinHeavyTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="cMinHeavyPrice"
        label="最低一票成本价格（不含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.cMinHeavyPrice">
            <span class="col-content">{{ scope.row.cMinHeavyPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="minHeavyTaxPrice"
        label="最低一票销售价格（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.minHeavyTaxPrice">
            <span class="col-content">{{ scope.row.minHeavyTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="minHeavyPrice"
        label="最低一票销售价格（不含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.minHeavyPrice">
            <span class="col-content">{{ scope.row.minHeavyPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="cTaxPrice"
        label="重量成本价格（含税）"
        width="120"
      >
        <template slot-scope="scope">
          <span v-show="scope.row.cTaxPrice">
            <span class="col-content">{{ scope.row.cTaxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="cPrice" label="重量成本价格（不含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.cPrice">
            <span class="col-content">{{ scope.row.cPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="taxPrice" label="重量销售价格（含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.taxPrice">
            <span class="col-content">{{ scope.row.taxPrice }}</span
            ><span class="col-suffix">{{ '元' }}</span>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="重量销售价格（不含税）" width="120">
        <template slot-scope="scope">
          <span v-show="scope.row.price">
            <span class="col-content">{{ scope.row.price }}</span
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
        prop="pushStateDesc"
        label=" 推送审核状态"
        width="120"
      ></el-table-column>

      <el-table-column
        prop="applyNO"
        label=" 申请单号"
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

      <el-table-column prop="remark" label="备注" width="120"></el-table-column>

      <el-table-column
        prop="addDate"
        label=" 创建时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="editDate"
        label=" 修改时间"
        width="140"
      ></el-table-column>

      <el-table-column
        prop="operatorId"
        label=" 操作人"
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
        <el-form-item label="唯一编号" v-show="false" prop="saleId">
          <el-input
            v-model="addForm.data.saleId"
            placeholder=""
            style="width:165px;"
            clearable
            disabled
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label=" 申请单号" v-show="true" prop="applyNO">
          <el-input
            v-model="addForm.data.applyNO"
            placeholder=""
            style="width:165px;"
            clearable
            disabled
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="零担价格表名称" v-show="true" prop="priceName">
          <el-input
            v-model="addForm.data.priceName"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="成本价明细表价格ID" v-show="false" prop="costId">
          <el-input
            v-model="addForm.data.costId"
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

        <el-form-item label="线路说明" v-show="true" prop="reserveds">
          <el-select
            v-model="addForm.data.reserveds"
            filterable
            placeholder="请选择区域类型"
            style="width:165px"
            clearable
          >
            <el-option
              v-for="(item, index) in selectArr.reserveds"
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

        <el-form-item label=" 预计最多天数" v-show="true" prop="effectMaxTime">
          <el-input
            v-model="addForm.data.effectMaxTime"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">天</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="最低一票成本价格（含税）"
          v-show="true"
          prop="cMinHeavyTaxPrice"
        >
          <el-input
            v-model="addForm.data.cMinHeavyTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="最低一票成本价格（不含税）"
          v-show="true"
          prop="cMinHeavyPrice"
        >
          <el-input
            v-model="addForm.data.cMinHeavyPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="最低一票销售价格（含税）"
          v-show="true"
          prop="minHeavyTaxPrice"
        >
          <el-input
            v-model="addForm.data.minHeavyTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="最低一票销售价格（不含税）"
          v-show="true"
          prop="minHeavyPrice"
        >
          <el-input
            v-model="addForm.data.minHeavyPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="重量成本价格（含税）"
          v-show="true"
          prop="cTaxPrice"
        >
          <el-input
            v-model="addForm.data.cTaxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="重量成本价格（不含税）"
          v-show="true"
          prop="cPrice"
        >
          <el-input
            v-model="addForm.data.cPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item
          label="重量销售价格（含税）"
          v-show="true"
          prop="taxPrice"
        >
          <el-input
            v-model="addForm.data.taxPrice"
            placeholder=""
            style="width:165px;"
            clearable
          >
            <i slot="suffix" class="el-input__icon">元</i>
          </el-input>
        </el-form-item>

        <el-form-item label="重量销售价格（不含税）" v-show="true" prop="price">
          <el-input
            v-model="addForm.data.price"
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

        <el-form-item label=" 结束有效期" v-show="true" prop="endDate">
          <el-date-picker
            v-model="addForm.data.endDate"
            type="date"
            style="width:165px"
            value-format="yyyy-MM-dd"
            placeholder="选择 结束有效期"
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

        <el-form-item label=" 创建时间" v-show="false" prop="addDate">
          <el-date-picker
            v-model="addForm.data.addDate"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择 创建时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label=" 修改时间" v-show="false" prop="editDate">
          <el-date-picker
            v-model="addForm.data.editDate"
            type="datetime"
            style="width:165px"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择 修改时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label=" 操作人" v-show="false" prop="operatorId">
          <el-input
            v-model="addForm.data.operatorId"
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
  getSpriceLd,
  addSpriceLdNew,
  upSpriceLd,
  delSpriceLd,
  auditSpriceLd,
  addQueueList,
  addAreaList,
  exportPrices,
  importPricesLdNew,
  getFleetList
} from '@/api/WoMallManagement/ltl-sales-price';
import { getAreaList } from '@/api/WoMallManagement/address';
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
        title: '零担线路销售价格查询',
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
        reserveds: [
          { value: '0', label: '价格优先' },
          { value: '1', label: '时效优先' }
        ],

        checkState: [
          { value: '0', label: '未审核' },
          { value: '1', label: '已审核' }
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
        saleId: '',
        priceName: '',
        fleetId: '',
        sendProvinceId: '',
        sendCityId: '',
        receiveProvinceId: '',
        receiveCityId: ''
      },
      addForm: {
        data: {
          saleId: '',
          applyNO: '',
          priceName: '',
          costId: '',
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
          reserveds: '',
          effectMinTime: '',
          effectMaxTime: null,
          cMinHeavyTaxPrice: '',
          cMinHeavyPrice: '',
          minHeavyTaxPrice: '',
          minHeavyPrice: '',
          cTaxPrice: '',
          cPrice: '',
          taxPrice: '',
          price: '',
          protectedPriceRate: '',
          tax: '',
          remark: '',
          startDate: '',
          endDate: '',
          checkState: '0',
          pushState: '0',
          addDate: '',
          editDate: '',
          operatorId: ''
        },
        config: {
          disabled: false
        },
        rules: {
          saleId: [],

          applyNO: [],

          priceName: [
            {
              required: true,
              trigger: 'blur',
              message: '零担价格表名称不能为空'
            }
          ],

          costId: [],

          fleetId: [],

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
          reserveds: [
            {
              required: true,
              trigger: 'blur',
              message: '线路说明不能为空'
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

          cMinHeavyTaxPrice: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          cMinHeavyPrice: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          minHeavyTaxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '最低一票销售价格（含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          minHeavyPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '最低一票销售价格（不含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          cTaxPrice: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          cPrice: [
            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          taxPrice: [
            {
              required: true,
              trigger: 'blur',
              message: '重量销售价格（含税）不能为空'
            },

            {
              trigger: 'change',
              validator: validateNumber
            }
          ],

          price: [
            {
              required: true,
              trigger: 'blur',
              message: '重量销售价格（不含税）不能为空'
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

          remark: [],

          startDate: [],

          endDate: [],

          checkState: [],

          pushState: [],

          addDate: [],

          editDate: [],

          operatorId: []
        }
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
        return c.saleId;
      });
    }
  },
  metas: {
    title: '零担线路销售价格查询',
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
      getSpriceLd(data)
        .then(res => {
          if (res.data.resultCode == 1) {
            let cols =
              '零担价格表名称,承运商名称,审核状态,始发省名称,始发市名称,目的省名称,目的地市名称,流向,区域类型,预计最少天数, 预计最多天数,最低一票成本价格（含税）,最低一票成本价格（不含税）,最低一票销售价格（含税）,最低一票销售价格（不含税）,重量成本价格（含税）,重量成本价格（不含税）,重量销售价格（含税）,重量销售价格（不含税）,价保费率,税率, 推送审核状态, 申请单号,起始有效期,结束有效期,备注, 创建时间, 修改时间, 操作人';
            let fields =
              'priceName,fleetName,checkStateDesc,sendProvinceName,sendCityName,receiveProvinceName,receiveCityName,direction,areaTypeDesc,effectMinTime,effectMaxTime,cMinHeavyTaxPrice,cMinHeavyPrice,minHeavyTaxPrice,minHeavyPrice,cTaxPrice,cPrice,taxPrice,price,protectedPriceRate,tax,pushStateDesc,applyNO,startDate,endDate,remark,addDate,editDate,operatorId';
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
      getSpriceLd(
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
                !isNaN(item.cMinHeavyTaxPrice) &&
                item.cMinHeavyTaxPrice !== '' &&
                item.cMinHeavyTaxPrice !== null
              ) {
                let cMinHeavyTaxPrice = new Big(item.cMinHeavyTaxPrice || 0);
                item.cMinHeavyTaxPrice = parseFloat(
                  cMinHeavyTaxPrice.toFixed(4)
                );
              }

              if (
                !isNaN(item.cMinHeavyPrice) &&
                item.cMinHeavyPrice !== '' &&
                item.cMinHeavyPrice !== null
              ) {
                let cMinHeavyPrice = new Big(item.cMinHeavyPrice || 0);
                item.cMinHeavyPrice = parseFloat(cMinHeavyPrice.toFixed(4));
              }

              if (
                !isNaN(item.minHeavyTaxPrice) &&
                item.minHeavyTaxPrice !== '' &&
                item.minHeavyTaxPrice !== null
              ) {
                let minHeavyTaxPrice = new Big(item.minHeavyTaxPrice || 0);
                item.minHeavyTaxPrice = parseFloat(minHeavyTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.minHeavyPrice) &&
                item.minHeavyPrice !== '' &&
                item.minHeavyPrice !== null
              ) {
                let minHeavyPrice = new Big(item.minHeavyPrice || 0);
                item.minHeavyPrice = parseFloat(minHeavyPrice.toFixed(4));
              }

              if (
                !isNaN(item.cTaxPrice) &&
                item.cTaxPrice !== '' &&
                item.cTaxPrice !== null
              ) {
                let cTaxPrice = new Big(item.cTaxPrice || 0);
                item.cTaxPrice = parseFloat(cTaxPrice.toFixed(4));
              }

              if (
                !isNaN(item.cPrice) &&
                item.cPrice !== '' &&
                item.cPrice !== null
              ) {
                let cPrice = new Big(item.cPrice || 0);
                item.cPrice = parseFloat(cPrice.toFixed(4));
              }

              if (
                !isNaN(item.taxPrice) &&
                item.taxPrice !== '' &&
                item.taxPrice !== null
              ) {
                let taxPrice = new Big(item.taxPrice || 0);
                item.taxPrice = parseFloat(taxPrice.toFixed(4));
              }

              if (
                !isNaN(item.price) &&
                item.price !== '' &&
                item.price !== null
              ) {
                let price = new Big(item.price || 0);
                item.price = parseFloat(price.toFixed(4));
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
                  saleId: item.saleId
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
      this.dialog.title = '新增零担线路销售价格查询';
      this.dialog.status = 0;
      this.addForm.config.disabled = false;
    },
    submitAddData(data) {
      addSpriceLdNew(data).then(res => {
        if (res.data.resultCode === 1) {
          // this.dialogTableVisible = false;
          this.searchFormMethod();
          this.addForm.data.saleId = res.data.data;
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
      delSpriceLd(this.selectIds)
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
        saleIds: this.selectIds
      };
      auditSpriceLd(data)
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
      upSpriceLd(data).then(res => {
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
      this.dialog.title = '编辑零担线路销售价格查询';
      this.dialog.status = 1;
      this.addForm.config.disabled = true;
      this.addForm.data.saleId = row.saleId;

      getSpriceLd({
        saleId: row.saleId || -1
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
              !isNaN(item.cMinHeavyTaxPrice) &&
              item.cMinHeavyTaxPrice !== '' &&
              item.cMinHeavyTaxPrice !== null
            ) {
              let cMinHeavyTaxPrice = new Big(item.cMinHeavyTaxPrice || 0);
              item.cMinHeavyTaxPrice = parseFloat(cMinHeavyTaxPrice.toFixed(4));
            }

            if (
              !isNaN(item.cMinHeavyPrice) &&
              item.cMinHeavyPrice !== '' &&
              item.cMinHeavyPrice !== null
            ) {
              let cMinHeavyPrice = new Big(item.cMinHeavyPrice || 0);
              item.cMinHeavyPrice = parseFloat(cMinHeavyPrice.toFixed(4));
            }

            if (
              !isNaN(item.minHeavyTaxPrice) &&
              item.minHeavyTaxPrice !== '' &&
              item.minHeavyTaxPrice !== null
            ) {
              let minHeavyTaxPrice = new Big(item.minHeavyTaxPrice || 0);
              item.minHeavyTaxPrice = parseFloat(minHeavyTaxPrice.toFixed(4));
            }

            if (
              !isNaN(item.minHeavyPrice) &&
              item.minHeavyPrice !== '' &&
              item.minHeavyPrice !== null
            ) {
              let minHeavyPrice = new Big(item.minHeavyPrice || 0);
              item.minHeavyPrice = parseFloat(minHeavyPrice.toFixed(4));
            }

            if (
              !isNaN(item.cTaxPrice) &&
              item.cTaxPrice !== '' &&
              item.cTaxPrice !== null
            ) {
              let cTaxPrice = new Big(item.cTaxPrice || 0);
              item.cTaxPrice = parseFloat(cTaxPrice.toFixed(4));
            }

            if (
              !isNaN(item.cPrice) &&
              item.cPrice !== '' &&
              item.cPrice !== null
            ) {
              let cPrice = new Big(item.cPrice || 0);
              item.cPrice = parseFloat(cPrice.toFixed(4));
            }

            if (
              !isNaN(item.taxPrice) &&
              item.taxPrice !== '' &&
              item.taxPrice !== null
            ) {
              let taxPrice = new Big(item.taxPrice || 0);
              item.taxPrice = parseFloat(taxPrice.toFixed(4));
            }

            if (
              !isNaN(item.price) &&
              item.price !== '' &&
              item.price !== null
            ) {
              let price = new Big(item.price || 0);
              item.price = parseFloat(price.toFixed(4));
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
        interfaceId: '2.5',
        interfaceName: '零担线路价格接口',
        paramId: this.selectIds.join(','),
        paramExt: '{"operationType":"1"}'
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
        interfaceId: '2.5',
        interfaceName: '零担线路价格接口',
        paramId: this.selectIds.join(','),
        paramExt: '{"operationType":"2"}'
      };
      this.pushMsg(data);
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
    handleImportBtnClickFunc() {
      this.$refs.uploadInput.click();
    },
    handleTemplateBtnClickFunc() {
      let data = {
        sFileName: '零担销售价格线路模板'
      };
      exportPrices(data)
        .then(res => {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }); //application/vnd.ms-excel  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
          if ('msSaveOrOpenBlob' in navigator) {
            window.navigator.msSaveOrOpenBlob(blob, 'checktask.xls');
          } else {
            let objectUrl = URL.createObjectURL(blob);
            window.location.href = objectUrl;
          }
        })
        .catch(err => {});
    },
    fileUpload(event) {
      // 上传文件
      console.log(event);

      let file = event.target.files;
      let formData = new FormData();
      formData.append('category', 'settingPic');
      formData.append('file', file[0]);
      console.log(formData);
      // 文件上传
      importPricesLdNew(formData)
        .then(res => {
          if (res.data.resultCode == 1) {
            this.$message.success('导入成功');
          } else {
            this.$message.error(res.data.message || '操作失败');
          }
          this.uploadLoading = false;
        })
        .catch(e => {
          this.uploadLoading = false;
          this.$message.error('操作失败');
          console.log(e);
        });
      this.$refs.uploadInput.value = '';
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
  activated() {},
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
