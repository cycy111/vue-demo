<template>
  <div class="title-box">
    <h1
      style="cursor:pointer;"
      @click="showCascader"
      v-if="hOneShow || !isCreateNew"
    >
      {{ hTitleOne }}
    </h1>
    <el-form :inline="true" size="small" v-if="!(hOneShow || !isCreateNew)">
      <el-form-item label="" prop="project">
        <el-select
          v-model="form.deptCode"
          filterable
          placeholder="请按地区和月份选择运营报告"
        >
          <el-option
            v-for="item in useDepartmentData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="project">
        <el-date-picker
          value-format="yyyyMM"
          v-model="monthly"
          type="month"
          placeholder="选择月份"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 编辑报告的对话框 -->
    <div class="dialog-edit-box">
      <el-dialog
        title="月报生成配置"
        :visible.sync="setReportDialog.dialogVisible"
        width="60%"
        :modal-append-to-body="false"
        v-dialogDrag
        v-dialogDragWidth
        :close-on-click-modal="false"
      >
        <el-form
          :model="form"
          ref="forms"
          status-icon
          :rules="rules"
          label-width="80px"
          :inline="true"
          label-position="right"
          size="small"
        >
          <!-- <el-form-item label="版本编号" title="版本号" :label-width="'80px'" prop="version">
            <el-input v-model="form.version" auto-complete="off" placeholder="新增时，该项必填。如：v5" style="width:216px;"></el-input>
          </el-form-item> -->
          <el-form-item label="历史版本" :label-width="'80px'" prop="kName">
            <el-select
              @change="historicVersionMethod"
              clearable
              v-model="historicVersionValue"
              placeholder="选择可查询历史版本记录"
            >
              <el-option
                v-for="item in historicVersions"
                :value-key="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用部门" :label-width="'80px'" prop="kName">
            <el-select
              v-model="form.deptCode"
              filterable
              placeholder="请选择使用部门"
            >
              <el-option
                v-for="(item, index) in useDepartmentData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注说明" :label-width="'80px'" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              auto-complete="off"
              style="width:216px;"
            ></el-input>
          </el-form-item>
          <h4>月报显示项选择：</h4>
          <el-table
            @selection-change="
              val => {
                return (this.multipleSelection = val);
              }
            "
            size="mini"
            ref="monthlyNewspaperModules"
            border
            show-header
            :data="table"
            :header-cell-style="{ background: '#F5F7FA' }"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="orderId" label="项目编号"></el-table-column>
            <el-table-column prop="itemName" label="项目名称"></el-table-column>
            <el-table-column label="拖动排序">
              <template>
                <el-button
                  class="cuozuai"
                  type="text"
                  icon="el-icon-rank"
                  size="mini"
                  style="cursor:move;"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="_cencalBtn()">取 消</el-button>
          <el-button type="primary" @click="_enterBtn()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import {
  getOperatingReportList,
  geReportItemInfo,
  addReportItem,
  addMonReportInfo
} from '@/api/yuebao/report';
import { Message } from 'element-ui';
import { setTimeout } from 'timers';

export default {
  name: 'HTitle',
  props: {
    //父组件传进来的部门数据

    isCreateNew: {
      //是否是新增
      type: Boolean,
      default() {
        return false;
      }
    },
    hTitleOne: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      historicVersionValue: '',
      historicVersions: [],
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
      monthly: '',
      dialogView: false,

      hOneShow: true,
      selectedOptions: [],
      selectedOptions2: [],
      pdfConfig: {
        hideEl: true
      },
      multipleSelection: [],
      setReportDialog: {
        dialogVisible: false
      },
      useDepartment: [],
      table: [],
      form: {
        deptCode: '',
        version: '',
        remark: ''
      },
      rules: {
        version: [
          {
            required: true,
            message: '版本编号必须填写',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!/^[a-zA-Z0-9]{1,10}$/.test(value)) {
                return callback(new Error('格式:1-10位大小写字母、数字'));
              }
              callback();
            }
          }
        ]
      }
    };
  },
  methods: {
    historicVersionMethod(val) {
      if (val) {
        geReportItemInfo({
          FindType: 'reportItemDt',
          DeptCode: this.form.deptCode,
          version: val
        }).then(res => {
          if (res.data.resultCode === 1 && res.data.data.reportItem.length) {
            let data = res.data.data.reportItem[0].item;
            if (data.length) {
              this.table = data;
              setTimeout(() => {
                this.table.forEach(item => {
                  // this.$refs.xx在父组件上使用子组件的值或方法
                  this.$refs.monthlyNewspaperModules.toggleRowSelection(item);
                });
              }, 50);
            }
          }
        });
      } else {
        this._geReportItemInfo();
      }
    },
    getDepartmentVersion() {
      geReportItemInfo({
        FindType: 'reportItem',
        DeptCode: this.form.deptCode
      }).then(res => {
        if (res.data.resultCode === 1 && res.data.data.reportItem.length) {
          let data = res.data.data.reportItem;
          data.forEach(item => {
            item.value = item.version;
            item.label = item.deptName + 'V' + item.version;
          });
          this.historicVersions = data;
        } else {
          this.historicVersions = [];
        }
      });
    },
    showCascader() {
      //不是新增的话就不能选大区
      if (!this.isCreateNew) {
        return;
      }
      this.hOneShow = false; //显示标题
    },
    handleChange(value) {
      //根据部门编号找到部门对象

      let h1 = this.useDepartmentData.find(item => {
        return item.value === this.form.deptCode;
      });
      //标题
      this.$emit(
        'updateHTitle',
        h1.label + '(' + this.monthly + ')' + '运营报告'
      );
      this.hOneShow = true; //隐藏选部门和月份的控件
      this.setReportDialog.dialogVisible = true; //打开选择月报对话框

      this._sortable(); //启动表的行可拖动
      this.getDepartmentVersion(); //获取部门历史版本

      let itemTable = this.$refs.monthlyNewspaperModules;
      itemTable && itemTable.clearSelection();
      this.form.version = '';
      this.form.remark = '';
    },
    _cencalBtn() {
      this.setReportDialog.dialogVisible = false;
    },
    _sortable() {
      setTimeout(() => {
        //console.log(this.$children[0].$parent.$refs.monthlyNewspaperModules.$el===this.$refs.monthlyNewspaperModules.$el);

        let el = this.$children[0].$parent.$refs.monthlyNewspaperModules.$el.querySelectorAll(
          '.el-table__body-wrapper > table > tbody'
        )[0];
        let sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          handle: '.cuozuai',
          setData: dataTransfer => {
            dataTransfer.setData('Text', '');
          },
          onEnd: evt => {
            let targetRow = this.table.splice(evt.oldIndex, 1)[0];
            this.table.splice(evt.newIndex, 0, targetRow);
            var newArray = this.table.slice(0);
            this.table = [];
            this.$nextTick(() => {
              this.table = newArray;
            });
          }
        });
      }, 50);
    },
    _enterBtn() {
      this.Bus.$emit('getHTitleData', {
        deptCode: this.form.deptCode,
        years: this.monthly.slice(0, 4),
        months: this.monthly.slice(4, 6)
      });
      //如果时新增状态
      if (!this.historicVersionValue) {
        //如果是新增状态需要校验版本号
        this.$refs['forms'].validate(valid => {
          // 验证此forms中规则
          if (valid) {
            let itemCode = this.multipleSelection.map(item => {
              return item.itemCode;
            }); //["kpiData", "amountInfo"]
            if (this.multipleSelection.length == 0) {
              Message({
                message: '请选择月报项目',
                type: 'error',
                duration: 2 * 1000
              });
              return;
            }
            addReportItem({
              DeptCode: this.form.deptCode,
              Version: this.form.version,
              Remark: this.form.remark,
              Item: this.multipleSelection
            }).then(res => {
              //新增成功
              if (res.data.resultCode === 1) {
                //渲染列表
                this._getOperatingReportList({
                  deptCode: this.form.deptCode,
                  years: this.monthly.slice(0, 4),
                  months: this.monthly.slice(4, 6),
                  findType: itemCode.join(',') + ',reportDesInfo'
                  //   Version:this.form.version
                }).then(result => {
                  if (result.data.resultCode === 1) {
                    this.Bus.$emit('getHTitleData', {
                      deptCode: this.form.deptCode,
                      years: this.monthly.slice(0, 4),
                      months: this.monthly.slice(4, 6)
                    });
                  }
                });
              } else {
                Message({
                  message: res.data.message,
                  type: 'error',
                  duration: 2 * 1000
                });
              }
            });
          }
        });
      } else {
        let itemCode = this.multipleSelection.map(item => {
          return item.itemCode;
        });
        this._getOperatingReportList({
          deptCode: this.form.deptCode,
          years: this.monthly.slice(0, 4),
          months: this.monthly.slice(4, 6),
          findType: itemCode.join(',') + ',reportDesInfo'
        }).then(result => {
          if (result.data.resultCode === 1) {
            this.Bus.$emit('getHTitleData', {
              deptCode: this.form.deptCode,
              years: this.monthly.slice(0, 4),
              months: this.monthly.slice(4, 6)
            });
          }
        });
      }
      //新增月报项目生成报告
      addMonReportInfo({
        DeptCode: this.form.deptCode,
        Years: this.monthly.slice(0, 4),
        Months: this.monthly.slice(4, 6),
        rptfile: [
          {
            Path:
              'http://192.168.1.193:8087/' +
              (this.monthly.slice(0, 4) + this.monthly.slice(4, 6)) +
              '/' +
              this.form.deptCode +
              '.pdf',
            FileName: this.form.deptCode + '.pdf',
            Remark: ''
          }
        ],
        Remark: ''
      }).then(res => {
        console.log(res.data, '新增月报');
      });
    },
    _getOperatingReportList(data) {
      return getOperatingReportList(data).then(res => {
        let itemCode = data.findType.split(','); //[kpiData,amountInfo,...]
        if (res.data.resultCode === 1) {
          let data = res.data.data;
          this.$emit(
            //子组件向父组件传递参数
            'dynamic-components-event',
            data,
            itemCode,
            this.tableTitle,
            true
          );
          this.setReportDialog.dialogVisible = false; //关闭对话框
          return res;
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 1 * 1000
        });
      });
    },
    _geReportItemInfo() {
      geReportItemInfo({ FindType: 'Items' }).then(item => {
        if (item.data.resultCode === 1) {
          this.table = item.data.data.items;
        }
      });
    }
  },
  created() {
    this._geReportItemInfo();
  },
  computed: {
    formDeptCode() {
      return this.form.deptCode;
    },
    useDepartmentData() {
      return this.$store.getters.userDepartments;
    }
  },
  watch: {
    formDeptCode() {
      if (this.form.deptCode && this.monthly) {
        this.handleChange();
      }
    },
    monthly() {
      if (this.form.deptCode && this.monthly) {
        this.handleChange();
      }
    }
  }
};
</script>
<style lang="scss">
.title-box {
  text-align: center;
  h1 {
    text-align: center;
    font-size: 28px;
    color: #3998fc;
  }
  .dialog-edit-box {
    text-align: left;
  }
}
</style>
