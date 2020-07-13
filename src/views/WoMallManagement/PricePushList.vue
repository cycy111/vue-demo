
    <template>
        <div class="app-container">
            <div ref="searchForm" class="el-container-custom">
                
        <el-form
            :inline = "true"
            v-show="true"
            :model="searchForm"
            ref="searchFormRef"
            size="small"
        >
          
            <el-form-item v-show="true" prop="applyNO">
                
            <el-input
                v-model="searchForm.applyNO"
                placeholder="请输入申请单号"
                style="width:150px;"
                clearable
            ></el-input>
        
            </el-form-item>
        
            <el-form-item v-show="false" prop="types">
                
            <el-input
                v-model="searchForm.types"
                placeholder="请输入消息类型"
                style="width:150px;"
                clearable
            ></el-input>
        
            </el-form-item>
        
            <el-form-item v-show="true" prop="msgTimeS">
                
      <el-date-picker
        v-model="searchForm.msgTimeS"
        type="datetime"
        style="width:165px"
        value-format="yyyy-MM-dd HH:mm:ss"
        
        placeholder="选择开始时间"
      >
      </el-date-picker>
    
            </el-form-item>
        
            <el-form-item v-show="true" prop="msgTimeE">
                
      <el-date-picker
        v-model="searchForm.msgTimeE"
        type="datetime"
        style="width:165px"
        value-format="yyyy-MM-dd HH:mm:ss"
        
        placeholder="选择结束时间"
      >
      </el-date-picker>
    
            </el-form-item>
        
          
        <el-form-item>
          <el-button type="default" size="small" @click="resetForm('searchFormRef')"
            >清空</el-button
          >
        </el-form-item>
      
      <el-form-item>
            <el-button type="primary" size="small" @click="handleQueryBtnClickFunc()"
              >查询</el-button
            >
          </el-form-item>
      
        <el-form-item>
          <el-button type="success" size="small" @click="handleExportBtnClickFunc()"
            >导出</el-button
          >
        </el-form-item>
      
        </el-form>
    
            </div>
            <div class="el-container" ref="actionForm">
                
        <el-form :inline="true">
            
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
            
        
    <el-table-column 
      type="selection" 
      width="60" 
      fixed>
    </el-table-column>
  
        <el-table-column
            type="index"
            label="序号"
            width="60"
            fixed
        ></el-table-column>
    
            <el-table-column
                prop="routeAgreementNo"
                label="招募入围编号"
                width="200"
                
            ></el-table-column>
        
            <el-table-column
                prop="applyNO"
                label="申请单号"
                width="120"
                
            ></el-table-column>
        
            <el-table-column
                prop="checkStateDesc"
                label="审批结果"
                width="120"
                
            ></el-table-column>
        
            <el-table-column
                prop="deliveredInfo"
                label="审批不通过原因"
                width="120"
                
            ></el-table-column>
        
            <el-table-column
                prop="totalPrice"
                label="价格"
                width="120"
                
            ></el-table-column>
        
            <el-table-column
                prop="remark"
                label="备注"
                width="200"
                
            ></el-table-column>
        
            <el-table-column
                prop="addDate"
                label="创建时间"
                width="150"
                
            ></el-table-column>
        
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
        import { validateNumber, validateMoblePhone,validateEmail } from '@/utils/validate';
        import {GetPushMsg} from '@/api/WoMallManagement/price-push-list'
        
    import * as moment from 'moment';
    
    
        const _ = require('lodash');
    
        export default {
            data(){
                return {
                    
        popoverVisible:{
            
        },
        dialog:{
            title: '线路价格审批结果查询',
            visible:false
        },
        selectArr:{
            
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
        searchForm:{
            applyNO:'', types:'7', msgTimeS:'', msgTimeE:'', 
        },
        addForm:{
            data:{
              
            },
            config:{
              disabled:false
            },
            rules:{
              
            }
        },
                  
    
                }
            },
            components: {
                
        
    
            },
            watch:{
                
        
    
            },
            computed: {
                
        selectIds(){
            return this.multipleSelection.map(c => {
                return c.id;
            });
        },
    
      
    
            },
            metas: {
                
        title: '线路价格审批结果查询',
        titleTemplate: '%s - 兆航物流TMS后台管理系统',
    
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
        searchFormMethod(currentPage,needSaveSelect=true) {
            if (currentPage) {
                this.tables.postParams.currentPage = currentPage;
            }
            tirmFilter(this.searchForm);
            let data = _.assignIn({}, this.searchForm);
            data.pageSize = this.tables.postParams.pageSize;
            data.pageIndex = this.tables.postParams.currentPage;
            this.queryData(data,needSaveSelect);
        },
        currentPageChange(currentPageNum) {
            this.searchFormMethod(currentPageNum);
        },
        
      handleQueryBtnClickFunc(){
          this.searchFormMethod(1,false);
      },
      handleExportBtnClickFunc() {
        tirmFilter(this.searchForm);
        let data = _.assign({ pageIndex: 1, pageSize: 10000 }, this.searchForm);
        GetPushMsg(data)
          .then((res) => {
            if (res.data.resultCode == 1) {
              let cols = '招募入围编号,申请单号,审批结果,审批不通过原因,价格,备注,创建时间'
              let fields = 'routeAgreementNo,applyNO,checkStateDesc,deliveredInfo,totalPrice,remark,addDate'
              tableToExcel(res.data.data, cols, fields);
            } else {
              Message({
                message: res.data.message,
                type: "error",
                duration: 3 * 1000,
              });
            }
          })
          .catch((err) => {
            Message({
              message: err,
              type: "error",
              duration: 3 * 1000,
            });
          });
      }, 

      queryData(data,needSaveSelect) {
        let reqData = data
        ? data
        : {
            pageSize: this.tables.postParams.pageSize,
            pageIndex: this.tables.postParams.currentPage
          };
        GetPushMsg(
          data
        ).then(res => {
          if (res.data.resultCode === 1) {
            let data = res.data.data;
            
            this.tables.tableData = data;
            if (needSaveSelect) {
              for (let item of this.multipleSelection) {
                let obj = _.find(this.tables.tableData, {
                  id: item.id
                });
                if (obj) {
                  setTimeout(() => {
                    console.log(obj);
                    this.$refs.multipleTable.toggleRowSelection(obj, true);
                  }, 0);
                }
              }
            }
            if (reqData.pageIndex == 1) {
              this.tables.postParams.total = res.data.counts;
            }
            return;
          }
          this.tables.tableData = [];
          if (_.includes(res.data.message, '无效')) {
            return Message({
              message: '当前部门暂未开通此功能，请联系管理员',
              type: 'error',
              duration: 3 * 1000
            });
          }
          Message({
            message: res.data.message,
            type: 'error',
            duration: 3 * 1000
          });
        }).catch(err=>{
            Message({
                message: err,
                type: 'error',
                duration: 3 * 1000
            });
        });
    },   
    
        
        
        sortChangeFunc(obj) {
          this.tables.postParams.orderDirection = obj.order;
          this.tables.postParams.orderProp = obj.prop;
          this.searchFormMethod(1,false);
        },
        
        
    
        
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        subAddForm(){
          this.$refs["addFormRef"].validate(valid => {
            if (valid) {
              let data = JSON.parse(JSON.stringify(this.addForm.data));
              //清楚左右空格
              tirmFilter(data);
              //将百分号的项除以100后保存
              

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
            activated(){
                
        
    
        // this.handleQueryBtnClickFunc();
    
            },
            mounted(){
                
        this.setTableMaxHeight();
    
    // this.searchForm.deptCode = this.deptCode;
        // this.handleQueryBtnClickFunc();
    
            },
            created(){
                
        
    
            },
            beforeRouteLeave(to, from, next) {
                
        
    
                next();
            }
        }
    </script>
    <style lang="less">
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
      .dialog-content{

      }
      
        
        
        
            
    
    </style>
