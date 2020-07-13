<template>
  <div class="suspensionMenuBox">
    <ul class="right-menu-box" v-if="pdfConfig.hideEl">
      <li>
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          title="保存"
          @click="_savePage"
        ></el-button>
      </li>
      <!-- <li>
				<el-button type="primary" icon="el-icon-setting" circle title="设置报告" @click="_setReport"></el-button>
			</li> -->
      <!-- <li>
				<el-button type="primary" icon="el-icon-edit-outline" circle title="生成报告" @click="_markReport"></el-button>
			</li> -->
      <li>
        <el-button
          type="primary"
          class="iconfont icon-pdf"
          circle
          title="输出PDF"
          @click="markPDF"
        ></el-button>
      </li>
    </ul>
    <!-- 编辑报告的对话框 -->
    <el-dialog
      title="月报生成配置"
      :visible.sync="setReportDialog.dialogVisible"
      width="50%"
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
        :inline="false"
        label-position="right"
        size="small"
      >
        <el-form-item
          label="版本号"
          title="版本号"
          :label-width="'80px'"
          prop="kCode"
        >
          <el-input
            v-model="form.kCode"
            auto-complete="off"
            placeholder="必填(英文大小写、数字5-18位)"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用部门" :label-width="'80px'" prop="kName">
          <el-select
            v-model="form.deptCode"
            filterable
            placeholder="请选择使用部门"
            style="width:100%"
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
          ></el-input>
        </el-form-item>
        <h4>月报显示项选择：</h4>
        <el-table
          size="mini"
          ref="monthlyNewspaperModules"
          border
          show-header
          :data="table"
          :header-cell-style="{ background: '#F5F7FA' }"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="num" label="项目编号"></el-table-column>
          <el-table-column prop="name" label="项目名称"></el-table-column>
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
</template>

<script>
import jsPDF from 'jspdf';
import Sortable from 'sortablejs';
import html2canvas from 'html2canvas';
import '@/directives/dialogCtrl.js';
import { getOperatingReportList } from '@/api/yuebao/report';
export default {
  name: 'SuspensionMenu',
  props: {
    useDepartmentData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      pdfConfig: {
        hideEl: true
      },
      setReportDialog: {
        dialogVisible: false
      },
      useDepartment: [],
      table: [
        {
          num: '1',
          name: '王小虎1',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          num: '2',
          name: '王小虎2',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          num: '3',
          name: '王小虎3',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          num: '4',
          name: '王小虎4',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      form: {
        deptCode: '',
        kCode: '',
        remark: ''
      },
      rules: {
        kCode: [
          {
            required: true,
            message: 'kpi编号必须填写',
            trigger: 'change'
          },
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!/^[a-z0-9]{5,16}$/.test(value)) {
                return callback(new Error('格式:5-16位小写字母、数字'));
              }
              callback();
            }
          }
        ]
      }
    };
  },
  methods: {
    _savePage() {
      console.info('save');
    },
    markPDF() {
      this.pdfConfig.hideEl = false;
      let dialogBody = this.$parent.$parent.$refs.dialogBody;
      setTimeout(() => {
        let targetDom = dialogBody;
        let domHeight = dialogBody.ownerDocument.defaultView.innerHeight;
        dialogBody.ownerDocument.defaultView.innerHeight =
          targetDom.offsetHeight;
        //把需要导出的pdf内容clone一份，这样对它进行转换、微调等操作时才不会影响原来界面
        let copyDom = targetDom.cloneNode(true);
        //新的div宽高跟原来一样，高度设置成自适应，这样才能完整显示节点中的所有内容（比如说表格滚动条中的内容）
        // copyDom.style.offsetWidth = targetDom.offsetWidth + "px";
        // copyDom.style.offsetHeight = targetDom.offsetHeight + "px";
        //$("body").append(copyDom); //ps:这里一定要先把copyDom append到body下，然后再进行后续的glyphicons2canvas处理，不然会导致图标为空
        // document.body.appendChild(copyDom);
        html2canvas(targetDom, {
          allowTaint: false
          //   height: copyDom.offsetHeight,
          //   width:copyDom.offsetWidth
        }).then(canvas => {
          targetDom.ownerDocument.defaultView.innerHeight = domHeight;
          let imgData = canvas.toDataURL('image/jpeg');
          let img = new Image();
          let doc = null;
          img.src = imgData;
          //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.225是因为比例问题
          img.onload = function() {
            //此处需要注意，pdf横置和竖置两个属性，需要根据宽高的比例来调整，不然会出现显示不完全的问题
            if (this.width > this.height) {
              doc = new jsPDF('l', 'mm', [
                this.width * 0.225,
                this.height * 0.225
              ]);
            } else {
              doc = new jsPDF('p', 'mm', [
                this.width * 0.225,
                this.height * 0.225
              ]);
            }
            doc.addImage(
              imgData,
              'jpeg',
              this.width / 89,
              0,
              this.width * 0.205,
              this.height * 0.225
            );
            //根据下载保存成不同的文件名
            doc.save('pdf_' + new Date().getTime() + '.pdf');
          };
          //删除复制出来的div
          //copyDom.remove();
          this.pdfConfig.hideEl = true;
        });
      }, 300);
    },
    _markWord() {
      console.info('_markWord');
    },
    _markReport() {
      console.info('_markReport');
    },
    _cencalBtn() {
      let data = [
        {
          component: 'MonthlyReportTable',
          title: '取消啦？',
          textareaPosition: 'top'
        },
        {
          component: 'MonthlyReportTable',
          title: '44444444444444',
          textareaPosition: 'bottom'
        }
      ];
      this.$emit('dynamic-components-event', data);
    },
    _enterBtn() {
      this.$emit('dynamic-components-event', null);
    }
  }
};
</script>
<style lang="scss">
.right-menu-box {
  position: fixed;
  right: 3%;
  top: 50%;
  list-style: none;
  li {
    list-style: none;
    margin: 10px 0px;
  }
}
.suspensionMenuBox {
  text-align: left;
}
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: red !important;
}
</style>
