<template>
  <div class="welcome">
    <div class="app-container" v-if="!hasApprovalRole">仓配项目信息管理系统</div>
    <div id="myBoxCard" class="box-card" v-if="hasApprovalRole">
      <div class="card-header clearfix">
        <span class="title">我的待办</span>
        <i class="el-icon-arrow-down m-arrow" @click="toggleCard"></i>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"></el-button> -->
      </div>
      <transition name="el-fade-in-linear">
        <div class="card-content" v-show="showCardContent">
          <div v-if="waitApprovalData&&waitApprovalData.length>0">
            <div class="item-header">
              <span>任务名称</span>
              <span>系统单号</span>
              <span>提交人</span>
              <span>提交时间</span>
            </div>
            <div v-for="(item,index) in waitApprovalData" :key="index" class="item-content" @click="gotoApprovalInfo(item)">
              <span>领用申请单审批</span>
              <span>{{ item.docEntry }}</span>
              <span>{{ item.userName }}</span>
              <span>{{ item.createDate }}</span>
            </div>
          </div>
          <p class="no-data" v-if="!(waitApprovalData&&waitApprovalData.length>0)">暂无代办</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { getOutStorageList } from '@/api/wmsQuery/wms-order-approval';
const _ = require('lodash');
export default {
  name: 'welcome',
  data() {
    return {
      waitApprovalData: [
        // {
        //   docEntry: 'OTB2006300017',
        //   userName: '张三',
        //   createDate: '2020-06-30 20:33'
        // },
        // {
        //   docEntry: 'OTB2006300017',
        //   userName: '张三',
        //   createDate: '2020-06-30 20:33'
        // },
        // {
        //   docEntry: 'OTB2006300017',
        //   userName: '张三',
        //   createDate: '2020-06-30 20:33'
        // }
      ],
      showCardContent: true,
      selectElement: ''
    };
  },
  computed: {
    // 计算属性的 getter
    isApprovalUser: function() {
      // `this` 指向 vm 实例
      return true;
    },
    hasApprovalRole: function() {
      var userInfo = this.$store.getters.userInfo;
      if (userInfo && userInfo.roleList) {
        let roleList = userInfo.roleList;
        let result = _.find(roleList, c => {
          return c.roleId == 49;
        });
        if(result){
          return true;
        }else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  methods: {
    queryData() {
      var data = {
        checkStatus: '1',
        pageIndex: 1,
        pageSize: 50
      };
      getOutStorageList(data)
        .then(res => {
          if (res.data.resultCode === 1) {
            let data = res.data.data;
            this.waitApprovalData = data;
          }
          this.waitApprovalData = [];
        })
        .catch(err => {
          setTimeout(() => {
            this.queryData();
          }, 500);
        });
    },
    toggleCard(e) {
      this.showCardContent = !this.showCardContent;
      let rotate = 'rotate(0deg)';
      if (!this.showCardContent) {
        rotate = 'rotate(-90deg)';
      }
      e.target.style.webkitTransform = rotate;
      e.target.style.mozTransform = rotate;
      e.target.style.msTransform = rotate;
      e.target.style.oTransform = rotate;
      e.target.style.transform = rotate;
    },
    gotoApprovalInfo(row){
      let path = `/wmsQuery/WmsOrderApprovalInfo/${row.docEntry}`;
      this.$router.push(path);
    },
    mousedown(event) {
      this.selectElement = document.getElementById('myBoxCard');
      var div1 = this.selectElement;
      this.selectElement.style.cursor = 'move';
      this.isDowm = true;
      var distanceX = event.clientX - this.selectElement.offsetLeft;
      var distanceY = event.clientY - this.selectElement.offsetTop;
      // alert(distanceX)
      // alert(distanceY)
      console.log(distanceX);
      console.log(distanceY);
      document.onmousemove = function(ev) {
        var oevent = ev || event;
        div1.style.left = oevent.clientX - distanceX + 'px';
        div1.style.top = oevent.clientY - distanceY + 'px';
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        div1.style.cursor = 'default';
      };
    }
  },
  created() {},
  mounted() {
    this.queryData();
  },
  activated() {
    this.queryData();
  }
};
</script>

<style lang="less">
.welcome {
  width: 100%;
  padding: 5px 10px;
  position: relative;
  .box-card {
    margin: 10px 20px;
    position: absolute;
    width: 50%;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    .card-header {
      background-color: #42b983;
      color: #fff;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;
      padding: 5px 20px;
      -moz-user-select:none; /*火狐*/
      -webkit-user-select:none; /*webkit浏览器*/
      -ms-user-select:none; /*IE10*/
      -khtml-user-select:none; /*早期浏览器*/
      user-select:none;
    }
    .title {
      display: inline-block;
      line-height: 30px;
      height: 30px;
    }
    .m-arrow {
      float: right;
      padding: 7px 5px;
      transition: all 0.3s;
    }
    .el-card__body {
      padding: 0;
    }
    .card-content {
    }
    .item-header {
      font-size: 14px;
      font-weight: 420;
      span {
        color: #444;
      }
    }

    .item-header,
    .item-content {
      display: flex;
      border-bottom: 1px solid #eee;
      padding: 5px 20px;
      span {
        display: inline-block;
        text-align: left;
        line-height: 30px;
        height: 30px;
        &:nth-child(1) {
          width: 40%;
        }
        &:nth-child(2) {
          width: 25%;
        }
        &:nth-child(3) {
          width: 10%;
        }
        &:nth-child(4) {
          width: 25%;
        }
      }
    }
    .item-content {
      cursor: pointer;
      &:hover {
        background-color: #d1ecf1;
      }
      span {
        font-size: 14px;
        color: #495060;
        text-align: left;
      }
    }
    .no-data {
      color: #f56c6c;
      text-align: center;
    }
  }
}
</style>
