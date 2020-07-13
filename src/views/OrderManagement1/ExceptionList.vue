<template>
  <div class="exception-list app-container">
    <div class="el-container-custom">
      <el-container>
        <el-form :inline="true" ref="form" :model="form">
          <el-form-item label="">
            <el-input
              placeholder="请输入订单号"
              v-model="form.ordNo"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="请输入客户订单号"
              v-model="form.clientOrdNo"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              placeholder="请输入车牌号"
              v-model="form.plate"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="form.businessIds"
              multiple
              clearable
              :collapse-tags="true"
              placeholder="请选择业务"
              size="small"
            >
              <el-option
                v-for="item in businessList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
                    <el-date-picker v-model="form.creationTime" value-format="yyyy/MM/dd hh:mm:ss" size="small" type="datetimerange" align="right" unlink-panels range-separator="至" start-placeholder="出库开始日期" end-placeholder="出库结束日期" :picker-options="$util.pickerOptions"></el-date-picker>
                </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="_getAlarmList(1)" size="small"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </el-container>
    </div>
    <el-table
      :data="tables.data"
      style="width: 100%"
      tooltip-effect="dark"
      size="mini"
      border
      :max-height="tables.tableMaxHeight"
    >
      <el-table-column prop="ordNo" label="订单号" width="180" fixed="left">
      </el-table-column>
      <el-table-column prop="businessName" label="业务名称" width="200">
      </el-table-column>
      <el-table-column label="预警">
        <!-- <el-table-column
          prop="isTimeAlarm"
          label="延迟"
          width="80"
        >
        <template slot-scope="scope">
					<span :class="scope.row.isTimeAlarm==='有'?'has-alarm':''">{{scope.row.isTimeAlarm}}</span>
				</template>
        </el-table-column> -->
        <el-table-column prop="isOffset" label="偏移" width="80">
          <template slot-scope="scope">
            <span :class="scope.row.isOffset === '有' ? 'has-alarm' : ''">{{
              scope.row.isOffset
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isTire" label="胎压" width="80">
          <template slot-scope="scope">
            <span :class="scope.row.isTire === '有' ? 'has-alarm' : ''">{{
              scope.row.isTire
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isFatigue" label="疲劳驾驶" width="80">
          <template slot-scope="scope">
            <span :class="scope.row.isFatigue === '有' ? 'has-alarm' : ''">{{
              scope.row.isFatigue
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isSpeed" label="超速" width="80">
          <template slot-scope="scope">
            <span :class="scope.row.isSpeed === '有' ? 'has-alarm' : ''">{{
              scope.row.isSpeed
            }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="clientOrdNo" label="客户订单号" width="180">
      </el-table-column>
      <el-table-column prop="shipmentNo" label="装运编号" width="150">
      </el-table-column>
      <el-table-column prop="ordWorkflow" label="订单状态" width="80">
      </el-table-column>

      <el-table-column prop="plate" label="车牌号" width="100">
      </el-table-column>
      <el-table-column prop="" label="" width="100"> </el-table-column>
      <el-table-column prop="" label="" width="100"> </el-table-column>
      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="queryAlarm(scope.row)"
            type="text"
            size="small"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background
        small
        @current-change="currentPageChange"
        :current-page="form.pageIndex"
        :page-sizes="tables.pageSizes"
        :page-size="form.pageSize"
        layout="total,prev, pager, next"
        :total="tables.total"
        v-if="tables.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getAlarmList } from '@/api/OrderManagement1/orderAlarm';
import { Message } from 'element-ui';
import { pickerOptions } from '@/utils/index';
import { getUserInfo } from '@/api/users';
import { getBaseData, getDictionaryData } from '@/api/baseData';
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'ExceptionList',
  data() {
    return {
      form: {
        ordNo: '',
        clientOrdNo: '',
        plate: '',
        businessIds: [],
        pageIndex: 1,
        pageSize: 10
      },
      businessList: [],
      tables: {
        tableMaxHeight: document.body.clientHeight - 230,
        pageSizes: [10, 20, 30, 40],
        total: 0,
        data: []
      }
    };
  },
  methods: {
    _getAlarmList(pageIndex) {
      if (pageIndex) {
        this.form.pageIndex = pageIndex;
      } else {
        this.form.pageIndex = 1;
      }
      getAlarmList(this.form)
        .then(res => {
          if (res.data.resultCode == 1) {
            this.tables.data = res.data.data;
            if (res.data.pageIndex == 1) {
              this.tables.total = res.data.counts;
            }
          } else {
            Message({
              message: res.data.message,
              type: 'error',
              duration: 3 * 1000
            });
            //window.location.reload()
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
    currentPageChange(currentPageNum) {
      this._getAlarmList(currentPageNum);
    },
    getBusinessList() {
      if (this.userInfo.rightsType == 'SuperAdmin') {
        getBaseData()
          .then(res => {
            if (res.data.resultCode === 1 && res.data.data) {
              this.businessList = res.data.data.businessList.map(item => {
                return {
                  value: item.businessId,
                  label: item.businessName
                };
              });
            } else {
              Message({
                message: res.data.message + ',请刷新重试',
                type: 'error',
                duration: 3 * 1000
              });
              this.getBusinessList();
            }
          })
          .catch(err => {
            Message({
              message: '网络连接失败，请刷新重试',
              type: 'error',
              duration: 3 * 1000
            });
          });
      } else {
        getUserInfo({
          userId: this.userInfo.userId
        })
          .then(res => {
            if (res.data.resultCode == 1) {
              let userInfo = res.data.data;
              this.businessList = userInfo.businessList.map(item => {
                return {
                  value: item.businessId,
                  label: item.businessName
                };
              });
            } else {
              Message({
                message: res.data.message + ',请刷新重试',
                type: 'error',
                duration: 3 * 1000
              });
              this.getBusinessList();
            }
          })
          .catch(err => {
            Message({
              message: '网络连接失败，请刷新重试',
              type: 'error',
              duration: 3 * 1000
            });
          });
      }
    },
    queryAlarm(row) {
      //this.$router.replace({ path:'/ordermanagement/exceptiondetail',query:{ordIdx:row.ordIdx }});
      this.$router.push({
        path: '/OrderManagement/exceptiondetail/' + row.ordIdx
      });
    }
  },
  watch: {
    $route() {
      //路由变换时，刷新异常列表
      this._getAlarmList(this.form.pageIndex);
    }
  },
  computed: {
    userInfo: function() {
      return this.$store.getters.userInfo;
    }
    //   ...mapGetters({
    //       userInfo:"userInfo"
    //   })
    // ...mapGetters['userInfo']
  },
  mounted() {
    this._getAlarmList(1);
    this.getBusinessList();
  },
  created() {}
};
</script>

<style lang="scss">
.exception-list {
  .el-table th > .cell {
    text-align: center;
  }
}
.has-alarm {
  color: red;
}
</style>
