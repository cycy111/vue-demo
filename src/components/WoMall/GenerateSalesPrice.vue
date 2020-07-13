<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
  >
    <el-form
      :model="form"
      ref="genSalesPriceForm"
      status-icon
      :rules="rules"
      label-width="140px"
      label-position="left"
      size="small"
    >
      <el-form-item label-width="0px">
        <el-col :span="12">
          <el-form-item
            label="生成规则"
            :label-width="'140px'"
            prop="priceRule"
            clearable
          >
            <el-select v-model="form.priceRule" placeholder="请选择生成规则">
              <el-option
                v-for="(item, index) in genRules"
                :value-key="item.value"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="form.priceRule == 'fixed'"
            label="金额"
            prop="fixFee"
            :label-width="'80px'"
          >
            <el-input v-model="form.fixFee" style="width:120px"
              ><i slot="suffix" style="font-style:normal" class="metre"
                >元</i
              ></el-input
            >
          </el-form-item>
          <el-form-item
            v-if="form.priceRule == 'percent'"
            label="百分比"
            prop="percent"
            :label-width="'80px'"
          >
            <el-input v-model="form.percent" style="width:120px"
              ><i slot="suffix" style="font-style:normal" class="metre"
                >%</i
              ></el-input
            >
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="销售价格表名称" prop="priceName">
        <el-input v-model="form.priceName"></el-input>
      </el-form-item>
      <el-form-item label="价格有效期" required>
        <el-col :span="11">
          <el-form-item prop="startDate">
            <el-date-picker
              type="date"
              placeholder="选择起始日期"
              v-model="form.startDate"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleGenClick()">生成</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    initialCostPrice: Number,
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '生成销售价格',
      genRules: [
        { value: 'fixed', label: '按成本价增加固定费用' },
        { value: 'percent', label: '按成本价的百分比增加' }
      ],
      form: {
        priceName: '',
        priceRule: 'fixed',
        fixFee: '',
        percent: '',
        startDate: '',
        endDate: ''
      },
      rules: {
        priceName: [
          {
            required: true,
            trigger: 'blur',
            message: '价格表名称不能为空'
          }
        ],
        priceRule: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择价格类型'
          }
        ],
        fixFee: [
          {
            required: true,
            trigger: 'blur',
            message: '金额不能为空'
          }
        ],
        percent: [
          {
            required: true,
            trigger: 'blur',
            message: '百分比不能为空'
          }
        ],
        startDate: [
          {
            required: true,
            trigger: 'blur',
            message: '开始日期不能为空'
          }
        ],
        endDate: [
          {
            required: true,
            trigger: 'blur',
            message: '结束日期不能为空'
          }
        ]
      },
      dialogVisible: this.visible,
      costPrice: this.initialCostPrice,
      formConfig: {
        disabled: false
      }
    };
  },
  computed: {
    priceValue() {
      if (this.form.priceRule == 'fixed') {
        return this.form.fixFee;
      } else {
        let percent = this.form.percent;
        if (isNaN(percent)) {
          percent = 0;
        }
        return percent / 100;
      }
    },
    resultForm() {
      return {
        priceName: this.form.priceName,
        priceRule: this.form.priceRule,
        priceValue: this.priceValue,
        startDate: this.form.startDate,
        endDate: this.form.endDate
      };
    }
  },
  watch: {
    dialogVisible: function(val, oldVal) {
      if (val) {
        this.resetForm();
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    resetForm() {
      setTimeout(() => {
        this.$refs['genSalesPriceForm'].resetFields();
      }, 0);
    },
    handleGenClick() {
      this.$refs['genSalesPriceForm'].validate(valid => {
        if (valid) {
          this.$emit('okBtnClick', { ...this.resultForm });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style>
.line {
  text-align: center;
}
.el-input .el-input__suffix {
  right: 10px;
}
</style>
