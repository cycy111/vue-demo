<template>
  <div class="suspensionMenuBox">
    <ul class="right-menu-box" v-if="pdfConfig.hideEl">
      <li>
        <el-button
          type="success"
          icon="el-icon-check"
          circle
          title="保存"
          @click="savePDF"
        ></el-button>
      </li>
      <!-- <li>
        <el-button type="info" icon="iconfont icon-caogao" circle title="保存草稿" @click="_saveDraft"></el-button>
      </li> -->
      <li>
        <el-button
          type="primary"
          class="iconfont icon-pdf"
          circle
          title="打印"
          @click="makePdf"
        ></el-button>
      </li>
      <li>
        <el-button
          type="danger"
          aria-label="Close"
          class="el-icon-close"
          @click="
            () => {
              this.$emit('dialog-visible-event', false);
            }
          "
          circle
          title="关闭本页"
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
import { Printd } from 'printd';
const uuidv4 = require('uuid/v4');
import {
  getOperatingReportList,
  addReportDes,
  uploadPdf,
  addMonReportInfo,
  UpdateReportDes,
  SaveMonthReportFile
} from '@/api/yuebao/report';
import { Message } from 'element-ui';

export default {
  name: 'SuspensionMenu',
  props: {
    //父组件给子组件传递参数 component
    useDepartmentData: {
      type: Array,
      default() {
        return [];
      }
    },
    addComponentsList: {
      type: Array,
      default() {
        return [];
      }
    },
    childVal: {
      type: Object,
      default() {
        return {};
      }
    },
    edit: {
      type: Boolean,
      default() {
        return false;
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
      getHTitleData: [],
      table: [],
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
      },
      isPreview: true
    };
  },
  methods: {
    _saveDraft() {
      let data = this.addComponentsList.slice(0);
      let paramsArr = data
        .filter(item => {
          return item.textareaPosition && item;
        })
        .map(item => {
          item.deptCode = this.getHTitleData.deptCode;
          item.years = this.getHTitleData.years;
          item.months = this.getHTitleData.months;
          item.remark = item.textareaValue;
          item.orderId = item.dataKey;
          return item;
        });
      UpdateReportDes(paramsArr).then(res => {
        if (res.data.resultCode === 1) {
          return Message({
            message: res.data.message,
            type: 'success',
            duration: 2 * 1000
          });
        }
        Message({
          message: res.data.message,
          type: 'error',
          duration: 2 * 1000
        });
      });

      /*保存备注之后，之后回填数据*/
      getOperatingReportList({
        deptCode: this.getHTitleData.deptCode,
        years: this.getHTitleData.years,
        months: this.getHTitleData.months,
        findtype: 'reportDesInfo'
      }).then(res => {
        //console.log("获取备注信息---");
      });

      this.$emit('re-render-components', [
        { dataKey: 'amountInfo', textareaValue: '测试的返回数据了？' }
      ]);
    },
    _savePage() {
      this._saveDraft();
      addMonReportInfo({
        DeptCode: this.getHTitleData.deptCode,
        Years: this.getHTitleData.years,
        Months: this.getHTitleData.months,
        rptfile: [
          {
            Path:
              'http://192.168.1.193:8087/' +
              (this.getHTitleData.years + this.getHTitleData.months) +
              '/' +
              this.getHTitleData.deptCode +
              '.pdf',
            FileName: this.getHTitleData.deptCode + '.pdf',
            Remark: ''
          }
        ],
        Remark: ''
      }).then(res => {
        //console.log(res.data, "新增月报");
      });
    },
    canvasToImage() {
      // 获取画布的对象(canvas)
      var mycanvas = document.getElementsByTagName('canvas');
      for (let canvas of mycanvas) {
        // 获取画布的父对象(div)
        var parent = canvas.parentElement;
        // 根据画布内容生成图片
        var image = canvas.toDataURL('image/png');
        // 创建一个img图片对象元素
        var img = document.createElement('img');
        // 将画布生成的图片内容给img图片对象元素
        img.src = image;
        // 将画布宽度给img图片对象元素宽度
        img.width = canvas.width;
        // 将画布高度给img图片对象元素高度
        img.height = canvas.height;
        // 从画布所在的父元素里隐藏画布自己的内容
        canvas.classList.add('hide-it');
        // 将生成的图片内容加载到画布所在父元素的内容里
        parent.appendChild(img);
      }
    },
    makePdf() {
      //打印前的处理
      let _this = this;
      let edit = _this.edit;
      //隐藏掉右侧菜单
      _this.pdfConfig.hideEl = false;
      //隐藏掉仓库总体面积使用的各类按钮
      _this.Bus.$emit('changeEditStatus', false);
      let width = document.getElementById('report-container').style.width;
      document.getElementById('report-container').style.width = '210mm';
      _this.canvasToImage();

      //打印
      _this.doPrint().then(() => {
        //打印后的处理
        document.getElementById('report-container').style.width = width;
        if (edit) {
          //如果是编辑模式，保存pdf后显示为编辑模式
          _this.Bus.$emit('changeEditStatus', true);
        }
        _this.pdfConfig.hideEl = true;
      });

      //方案二：
      // const d = new Printd()
      // const cssText = `
      //   h1 {
      //     color: black;
      //     font-family: sans-serif;
      //   }
      // `
      // d.print( document.getElementById('report-container'), [ cssText ] )
    },
    doPrint() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let bdhtml = window.document.body.innerHTML;
          let sprnstr = '<div class="start-print"></div>'; //必须在页面添加<!--startprint-->和<!--endprint-->而且需要打印的内容必须在它们之间
          let eprnstr = '<div class="end-print"></div>';
          let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 31);
          prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));

          //  window.document.body.innerHTML = prnhtml;
          //  window.print();
          //  return;

          let newWin = window.open(''); //新打开一个空窗口
          let hstyle = `
                <style>
                  body{
                    overflow:auto;
                  }
                  #report-container{
                    width:210mm;
                  }

                  .el-table table{
                    font-size:12px;
                    
                  }
                  .el-table__empty-block{
                    height:auto;
                  }
                </style>
            `;
          let head = window.document.head.innerHTML;
          console.log(process.env.NODE_ENV);
          if (process.env.NODE_ENV != 'development') {
            head = head.replace(/\/css\//g, 'http://www.668tms.com/css/');
            head = head.replace(/\/js\//g, 'http://www.668tms.com/js/');
          }

          newWin.document.head.innerHTML = head + hstyle;

          newWin.document.body.innerHTML = prnhtml;
          newWin.document.head.title = newWin.document.getElementsByClassName(
            'title-box'
          )[0].children[0].textContent;
          //  newWin.document.getElementsByClassName("dialog-container")[0].style.width="210mm"
          //  newWin.document.body.style.overflow="auto";

          setTimeout(() => {
            console.log('print opened');
            newWin.document.close(); //在IE浏览器中使用必须添加这一句
            newWin.focus(); //在IE浏览器中使用必须添加这一句
            newWin.print(); //打印
            newWin.close(); //关闭窗口
            resolve();
          }, 50);
        }, 50);
      });
    },
    makePdf2() {
      let _this = this;
      //隐藏掉右侧菜单
      this.pdfConfig.hideEl = false;
      //隐藏掉仓库总体面积使用的各类按钮
      this.Bus.$emit('changeEditStatus', false);
      let dialogBody = this.$parent.$parent.$refs.dialogBody;
      setTimeout(() => {
        let targetDom = dialogBody;
        let domHeight = dialogBody.ownerDocument.defaultView.innerHeight;
        dialogBody.ownerDocument.defaultView.innerHeight =
          targetDom.offsetHeight;
        //把需要导出的pdf内容clone一份，这样对它进行转换、微调等操作时才不会影响原来界面
        let copyDom = targetDom.cloneNode(true);
        html2canvas(targetDom, {
          allowTaint: false
        }).then(canvas => {
          targetDom.ownerDocument.defaultView.innerHeight = domHeight;
          let imgData = canvas.toDataURL('image/jpeg');
          let img = new Image();
          let pdf = null;
          img.src = imgData;
          //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.225是因为比例问题
          img.onload = function() {
            //此处需要注意，pdf横置和竖置两个属性，需要根据宽高的比例来调整，不然会出现显示不完全的问题
            if (this.width > this.height) {
              pdf = new jsPDF('l', 'mm', [
                this.width * 0.225,
                this.height * 0.225
              ]);
            } else {
              pdf = new jsPDF('p', 'mm', [
                this.width * 0.225,
                this.height * 0.225
              ]);
            }
            pdf.addImage(
              imgData,
              'jpeg',
              this.width / 89,
              0,
              this.width * 0.205,
              this.height * 0.225
            );
            //根据下载保存成不同的文件名
            //let pdfData = pdf.output("datauristring");
            pdf.save(_this.getHTitleData.deptCode + '.pdf');
          };
          if (this.edit) {
            //如果是编辑模式，保存pdf后显示为编辑模式
            this.Bus.$emit('changeEditStatus', true);
          }

          this.pdfConfig.hideEl = true;
        });
      }, 300);
    },
    savePDF() {
      let _this = this;
      addMonReportInfo({
        DeptCode: _this.getHTitleData.deptCode,
        Years: _this.getHTitleData.years,
        Months: _this.getHTitleData.months,
        Remark: ''
      }).then(res1 => {
        if (res1.data.resultCode == 1) {
          Message({
            message: '保存成功！',
            type: 'success',
            duration: 2 * 1000
          });
        } else {
          Message({
            message: '保存失败',
            type: 'error',
            duration: 2 * 1000
          });
        }
      });
    },
    savePDF2() {
      let _this = this;
      //隐藏掉右侧菜单
      this.pdfConfig.hideEl = false;
      //隐藏掉仓库总体面积使用的各类按钮
      this.Bus.$emit('changeEditStatus', false);

      let dialogBody = this.$parent.$parent.$refs.dialogBody;
      setTimeout(() => {
        let targetDom = dialogBody;
        let domHeight = dialogBody.ownerDocument.defaultView.innerHeight;
        dialogBody.ownerDocument.defaultView.innerHeight =
          targetDom.offsetHeight;
        //把需要导出的pdf内容clone一份，这样对它进行转换、微调等操作时才不会影响原来界面
        let copyDom = targetDom.cloneNode(true);
        html2canvas(targetDom, {
          allowTaint: false
        }).then(canvas => {
          targetDom.ownerDocument.defaultView.innerHeight = domHeight;
          let imgData = canvas.toDataURL('image/jpeg');
          let img = new Image();
          let pdf = null;
          img.src = imgData;
          //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.225是因为比例问题
          img.onload = function() {
            //此处需要注意，pdf横置和竖置两个属性，需要根据宽高的比例来调整，不然会出现显示不完全的问题
            if (this.width > this.height) {
              pdf = new jsPDF('l', 'mm', [
                this.width * 0.225,
                this.height * 0.225
              ]);
            } else {
              pdf = new jsPDF('p', 'mm', [
                this.width * 0.225,
                this.height * 0.225
              ]);
            }
            pdf.addImage(
              imgData,
              'jpeg',
              this.width / 89,
              0,
              this.width * 0.205,
              this.height * 0.225
            );
            //根据下载保存成不同的文件名
            let pdfData = pdf.output('datauristring');
            // pdf.save("feji.pdf");
            // return;
            let fileName = _this.getHTitleData.deptCode + '.pdf';
            let m = /^\d$/.test(_this.getHTitleData.months)
              ? '0' + _this.getHTitleData.months
              : _this.getHTitleData.months;
            let uuid = uuidv4();
            uploadPdf({
              fileName: fileName,
              savePath: `MonthReport/${_this.getHTitleData.deptCode}/${_this.getHTitleData.years}${m}/${uuid}/${fileName}`,
              content: pdfData + ''
            }).then(res => {
              if (res.data.resultCode === 1) {
                addMonReportInfo({
                  DeptCode: _this.getHTitleData.deptCode,
                  Years: _this.getHTitleData.years,
                  Months: _this.getHTitleData.months,
                  Remark: ''
                }).then(res1 => {
                  //console.log(res1.data, "新增月报");
                  //将文件的path保存到月报表
                  return SaveMonthReportFile({
                    fileName: res.data.data.fileName,
                    filePath: res.data.data.filePath,
                    deptCode: _this.getHTitleData.deptCode,
                    year: _this.getHTitleData.years,
                    month: _this.getHTitleData.months
                  }).then(function(res2) {
                    return Message({
                      message: '保存pdf成功！',
                      type: 'success',
                      duration: 2 * 1000
                    });
                  });
                });
              } else {
                Message({
                  message: '保存pdf失败，' + res.data.message,
                  type: 'error',
                  duration: 2 * 1000
                });
              }
            });
            // doc.save("pdf_" + new Date().getTime() + ".pdf");
          };
          if (!this.isPreview) {
            //如果是编辑模式，保存pdf后显示为编辑模式
            this.Bus.$emit('changeEditStatus', true);
          }
          this.pdfConfig.hideEl = true;
        });
      }, 300);
    },
    _markWord() {
      console.info('_markWord');
    },
    _cencalBtn() {
      this.setReportDialog.dialogVisible = false;
    },
    _enterBtn() {}
  },
  created() {
    //通过this.Bus.$emit触发传递参数(只能是之类之间互相通信)
    this.getHTitleData = this.childVal;
    this.Bus.$on('getHTitleData', e => {
      this.getHTitleData = e;
    });
    this.isPreview = !this.edit;
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
