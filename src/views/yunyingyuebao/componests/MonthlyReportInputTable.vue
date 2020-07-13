<template>
  <div :class="'kpi-' + dataKey">
    <h2>{{ title }}</h2>
    <div class="para">
      <div
        v-show="!(tableData2.length == 0)"
        class="area-container"
        v-for="(item, index) in tableData2"
        :key="index"
      >
        <el-input
          v-if="textareaPosition === 'top'"
          type="textarea"
          :rows="2"
          placeholder="请手动输入KPI指标情况"
          v-model="textareaModelValue"
        ></el-input>
        <el-form
          :inline="true"
          :rules="model.rules1"
          :ref="'ruleForm' + index"
          :model="item"
        >
          <el-form-item>
            <span v-if="item.editTitle && edit"
              >{{ index + 1 }}）<el-input
                :ref="item.whCode + index"
                style="width:120px;"
                @blur="item.editTitle = false"
                :rules="model.rules1.whCode"
                v-model="item.whCode"
                placeholder="请输入仓库代码"
                size="mini"
              ></el-input
              >仓库</span
            >
            <h3
              @dblclick="item.editTitle = true"
              v-if="!(item.editTitle && edit)"
            >
              {{ index + 1 }}）{{ item.whCode }}仓库
            </h3>
          </el-form-item>
          <el-table
            @cell-dblclick="cellDblclick"
            :summary-method="getSummaries1"
            show-summary
            class="tables"
            ref="inputTables1"
            border
            show-header
            size="mini"
            :data="item.data"
            style="width: 100%;margin:10px 0px;"
            :header-cell-style="{ background: '#F5F7FA' }"
          >
            <el-table-column label="区域名称">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data.' + scope.$index + '.areaName'"
                  :rules="model.rules1.areaName"
                >
                  <el-input
                    @focus="scope.row.edit = true"
                    @blur="inputBlur(scope, index, item)"
                    v-if="scope.row.edit && edit"
                    v-model="scope.row.areaName"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                  <span v-if="!(scope.row.edit && edit)">{{
                    scope.row.areaName
                  }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="主要物资">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data.' + scope.$index + '.productName'"
                  :rules="model.rules1.productName"
                >
                  <el-input
                    @focus="scope.row.edit = true"
                    @blur="inputBlur(scope, index, item)"
                    v-if="scope.row.edit && edit"
                    v-model="scope.row.productName"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                  <span v-if="!(scope.row.edit && edit)">{{
                    scope.row.productName
                  }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="总面积">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data.' + scope.$index + '.size'"
                  :rules="model.rules1.size"
                >
                  <el-input
                    @focus="scope.row.edit = true"
                    @blur="inputBlur(scope, index, item)"
                    v-if="scope.row.edit && edit"
                    v-model="scope.row.size"
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                  <span v-if="!(scope.row.edit && edit)">{{
                    scope.row.size
                  }}</span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="使用率" :formatter="percenterFormatter">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'data.' + scope.$index + '.useRate'"
                  :rules="model.rules1.useRate"
                >
                  <el-input
                    @focus="scope.row.edit = true"
                    @blur="inputBlur(scope, index, item)"
                    v-if="scope.row.edit && edit"
                    v-model="scope.row.useRate"
                    placeholder="请输入内容"
                    size="mini"
                  >
                    <i slot="suffix" class="el-input__icon ">&nbsp;%&nbsp;</i>
                  </el-input>
                  <span v-if="!(scope.row.edit && edit)"
                    >{{ scope.row.useRate }}&nbsp;%&nbsp;</span
                  >
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="总占比">
              <template slot-scope="scope">
                <el-form-item :prop="'data.' + scope.$index + '.proportion'">
                  <!-- <el-input @focus="scope.row.edit=true" @blur="inputBlur(scope,index,item)" v-if="scope.row.edit && edit" v-model="scope.row.proportion" placeholder="请输入内容" size="mini">
                    <i slot="suffix" class="el-input__icon ">&nbsp;%&nbsp;</i>
                  </el-input> -->
                  <span
                    >{{
                      totalSize == 0
                        ? 0
                        : (scope.row.useRate * scope.row.size) / totalSize
                    }}&nbsp;%&nbsp;</span
                  >
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="opt" v-if="edit">
              <template slot-scope="scope">
                <el-form-item>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="delRowsOne(scope, index)"
                    >删除</el-button
                  >
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="contaienr-text-right" v-show="edit">
          <el-button type="primary" size="small" @click="addRowsOne(index)"
            >添加一行</el-button
          >
          <el-button
            type="success"
            size="small"
            @click="generateGraphy(item, index)"
            >生成饼图</el-button
          >
          <el-button type="danger" size="small" @click="delTable(index)"
            >删除仓库</el-button
          >
        </div>
        <!-- 图表组件 -->
        <div>&nbsp;</div>
        <div style="text-align:center;">
          <div style="width:80%;height:300px;" :ref="'graphy' + index"></div>
        </div>
        <div v-if="textareaPosition === 'bottom' && edit" class="el-textarea">
          <textarea
            autocomplete="off"
            rows="2"
            placeholder="本月小结（填写样板：本月入库多于出库，导致库存积压，周转率低下，望各单位及时领用。)"
            class="el-textarea__inner"
            style="min-height: 33px;"
            v-model="item.remark"
          ></textarea
          ><!---->
        </div>
        <!-- <input v-if="textareaPosition==='bottom'&&edit"   placeholder="本月小结（填写样板：本月入库多于出库，导致库存积压，周转率低下，望各单位及时领用。)" v-model="item.remark"/> -->
        <p class="summer" v-if="!(textareaPosition === 'bottom' && edit)">
          小结：{{ item.remark }}
        </p>
      </div>
      <div v-if="tableData2.length == 0" class="no-date-container">
        <p>暂无数据</p>
      </div>
      <div class="contaienr-text-right" v-if="edit">
        <el-button type="primary" size="small" @click="addTable"
          >添加仓库</el-button
        >
        <el-button type="success" size="small" @click="saveTables"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui';
import { SaveWhCodeArea } from '@/api/yuebao/report';
import Big from 'big.js';
import echarts from 'echarts';
var _ = require('lodash');
export default {
  name: 'MonthlyReportInputTable',
  props: {
    title: {
      type: String,
      default: '仓库总体面积使用'
    },
    textareaPosition: {
      type: String,
      default: 'none'
    },
    textareaValue: {
      type: String,
      default: ''
    },
    dataKey: {
      type: String,
      default: ''
    },
    isChart: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default() {
        return [
          {
            id: null,
            deptCode: this.deptCode,
            years: this.year,
            months: this.month,
            whCode: '',
            editTitle: true,
            remark: '',
            data: [
              {
                areaName: '',
                productName: '',
                size: '',
                useRate: '',
                proportion: '',
                edit: true
              }
            ],
            itemValue: null,
            itemName: '仓库总体面积使用',
            echart: [
              {
                title: 'A01仓库面积使用情况',
                model: 'whcodeArea',
                xAxis: ['工程物资', '备品物资'],
                series: [
                  {
                    data: ['0.50000', '0.90000'],
                    name: 'A01',
                    countType: null,
                    datetime: '2018-08'
                  }
                ],
                legend: []
              }
            ]
          }
        ];
      }
    },

    edit: {
      type: Boolean,
      default: false
    },
    year: {
      type: String,
      default: ''
    },
    month: {
      type: String,
      default: ''
    },
    deptCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData2: this.tableData,
      totalSize: 0,
      hideTableBtn: false,
      getHTitleData: {},
      form: {},
      remarkArr: [],
      model: {
        rules1: {
          whCode: [
            {
              trigger: 'change',
              message: '必填，格式：中英文字母数字',
              validator: (rule, value, callback) => {
                const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/;
                if (!value) {
                  return callback(new Error('必填，格式：中英文字母数字'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('必填，格式：中英文字母数字'));
                }
                return callback();
              }
            }
          ],
          areaName: [
            {
              trigger: 'change',
              message: '必填，格式：中英文字母数字',
              validator: (rule, value, callback) => {
                const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/;
                if (!value) {
                  return callback(new Error('格式：中英文字母'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('格式：中英文字母'));
                }
                return callback();
              }
            }
          ],
          productName: [
            {
              trigger: 'change',
              message: '必填，格式：中英文字母数字',
              validator: (rule, value, callback) => {
                const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,10}$/;
                if (!value) {
                  return callback(new Error('格式：中英文字母'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('格式：中英文字母'));
                }
                return callback();
              }
            }
          ],
          size: [
            {
              trigger: 'change',
              message: '必填，格式：正数',
              validator: (rule, value, callback) => {
                const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
                if (!value) {
                  return callback(new Error('格式：正数'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('格式：正数'));
                }
                return callback();
              }
            }
          ],
          useRate: [
            {
              trigger: 'change',
              message: '必填，格式：100以内正数',
              validator: (rule, value, callback) => {
                const reg = /^100$|^(\d|[1-9]\d)(\.\d+)*$/;
                if (!value) {
                  return callback(new Error('格式：100以内正数'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('格式：100以内正数'));
                }
                return callback();
              }
            }
          ],
          proportion: [
            {
              trigger: 'change',
              message: '必填，格式：100以内正数',
              validator: (rule, value, callback) => {
                const reg = /^100$|^(\d|[1-9]\d)(\.\d+)*$/;
                if (!value) {
                  return callback(new Error('格式：100以内正数'));
                }
                if (!reg.test(value)) {
                  return callback(new Error('格式：100以内正数'));
                }
                return callback();
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    textareaModelValue: {
      // 动态计算currentValue的值
      get() {
        return this.textareaValue; // 将props中的value赋值给currentValue
      },
      set(val) {
        this.$emit('input', val, {
          dataKey: this.dataKey,
          keyCode: 'textareaValue'
        }); // 通过$emit触发父组件
      }
    }
  },
  methods: {
    percenterFormatter(row, column, cellValue, index) {
      cellValue = cellValue * 100;
    },
    getSummaries1(param) {
      if (typeof param === 'object') {
        var { columns, data } = JSON.parse(JSON.stringify(param));
      }
      let sums = new Big(0),
        total = new Big(0);
      if (data.length) {
        data.forEach((column, index) => {
          sums = sums.plus(parseFloat(column.size || 0));
          total = total.plus(column.useRate * column.size);
        });
      }
      this.totalSize = parseFloat(sums.toFixed(2));
      this.totalprop = parseFloat(
        sums.toFixed(2) == 0 ? 0 : total.toFixed(2) / sums.toFixed(2)
      );
      return ['合计', '', this.totalSize, '', this.totalprop + '%'];
    },
    saveTables() {
      let isValid = true;
      for (let i = 0; i < this.tableData2.length; i++) {
        this.$refs['ruleForm' + i][0].validate(valid => {
          if (!valid) {
            //验证没通过
            isValid = false;
            Message({
              message: `保存失败，第${i + 1}个表的数据校验不通过`,
              type: 'error',
              duration: 2 * 1000
            });
          }
        });
        if (!isValid) {
          break;
        }
      }
      if (!isValid) {
        return;
      }
      //到此处时说明数据校验都成功了
      //保存数据到数据库
      let remarkStr = '';
      _.forEach(this.tableData2, function(item) {
        remarkStr += item.remark + '|';
      });
      SaveWhCodeArea({
        year: this.year,
        month: this.month,
        deptCode: this.deptCode,
        remark: remarkStr,
        whData: this.tableData2
      })
        .then(function(res) {
          if (res.data.resultCode == '1') {
            Message({
              message: '保存成功',
              type: 'success',
              duration: 2 * 1000
            });
          } else {
            Message({
              type: 'error',
              message: `${res.data.message}`,
              duration: 10 * 1000
            });
          }
        })
        .catch(function(res) {
          let message = res.message;
          if (message == 'Network Error') {
            message = '请检查网络';
          }
          Message({
            type: 'error',
            message: `${message}`,
            duration: 10 * 1000
          });
        });
    },
    addTable() {
      this.tableData2.push({
        id: null,
        deptCode: this.deptCode,
        years: this.year,
        months: this.month,
        whCode: '',
        editTitle: true,
        data: [
          {
            areaName: '',
            productName: '',
            size: '',
            useRate: '',
            proportion: '',
            edit: true
          }
        ],
        itemValue: null,
        itemName: '仓库总体面积使用',
        echart: [
          {
            title: 'A01仓库面积使用情况',
            model: 'whcodeArea',
            xAxis: ['工程物资', '备品物资'],
            series: [
              {
                data: ['0.50000', '0.90000'],
                name: 'A01',
                countType: null,
                datetime: '2018-08'
              }
            ],
            legend: []
          }
        ]
      });
    },
    delTable(index) {
      this.tableData2.splice(index, 1);
    },
    addRowsOne(index) {
      //console.log(index)
      this.tableData2[index].data.push({
        areaName: '',
        productName: '',
        size: '',
        useRate: '',
        proportion: '',
        opt: 'operating',
        edit: true
      });
    },
    delRowsOne(row, index) {
      //console.log(row.$index)
      this.tableData2[index].data.splice(row.$index, 1);
    },
    cellDblclick: function(row, column, cell, event) {
      if (!this.edit) {
        return;
      }
      row.edit = true;
      this.$nextTick(function() {
        cell.querySelector('input').focus();
      });
    },
    inputBlur(scope, index, item) {
      this.$refs['ruleForm' + index][0].validate(valid => {
        if (valid) {
          scope.row.edit = false;
          if (item) {
            this.generateGraphy(item, index);
          }
        } else {
          return false;
        }
      });
    },
    generateGraphy(item, index) {
      //console.log(this.$refs['graphy'+item.whCode] +"fuxily");
      var legendData = [];
      var seriesData = [];
      var hasData = false;
      var totalSize = 0;
      _.forEach(item.data, function(item, index) {
        totalSize += parseFloat(item.size || 0);
      });

      _.forEach(item.data, function(item, index) {
        legendData.push(item.productName);
        hasData = true;
        seriesData.push({
          value: (item.useRate * item.size) / totalSize,
          name: item.productName
        });
      });
      if (!hasData) {
        return;
      }
      var option = {
        model: 'whcodeArea',
        title: {
          text: `${item.whCode}仓库面积使用情况`,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legendData
        },
        label: {
          normal: {
            position: 'inside'
          }
        },
        //color:['#FF1D02','#31F817','#583FDB','#FFFD3E','#92FFFF','#983EDB'],
        series: [
          {
            name: '面积总占比',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: seriesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {d}%'
                },
                labelLine: { show: true }
              }
            }
          }
        ]
      };
      echarts.init(this.$refs['graphy' + index][0]).setOption(option);
    }
  },
  mounted() {
    var that = this;
    _.forEach(this.tableData2, function(item, index) {
      that.generateGraphy(item, index);
    });
  },
  created() {
    this.Bus.$on('getHTitleData', e => {
      this.getHTitleData = e;
    });
    //设置每个仓库的备注
    let remark = this.textareaValue.split('|');
    _.forEach(this.tableData2, function(item, index) {
      item.remark = remark[index];
    });
  },
  watch: {
    tableData2(newData, oldData) {
      var that = this;
      _.forEach(newData, function(item, index) {
        that.generateGraphy(item, index);
      });
    }
  }
};
</script>
<style lang="scss">
.kpi-one h2 {
  text-align: left;
}
.contaienr-text-right {
  text-align: right;
  padding: 5px;
}
// .tables {
//   .el-table__row {
//     .el-form-item {
//       margin-bottom: 0px;
//     }
//   }
// }

.para {
  padding: 0 2em;
}
.no-date-container {
  text-align: center;
}
.summer {
  color: red;
}
</style>
