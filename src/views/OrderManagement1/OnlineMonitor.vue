<template>
  <div class="online-monitor">
    <div
      id="mapContainer"
      class="map-container"
      :style="'height:' + mapHeight + 'px'"
    ></div>
    <div class="search-form-container" v-if="false">
      <el-form
        ref="mapSearchForm"
        :model="searchForm"
        label-width="86px"
        size="mini"
      >
        <el-form-item label="开始时间：">
          <!-- <span class="demonstration">带快捷选项</span> -->
          <el-date-picker
            v-model="searchForm.bgnTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="onDateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：">
          <!-- <span class="demonstration">带快捷选项</span> -->
          <el-date-picker
            v-model="searchForm.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="onDateChange"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="流程状态：">
          <el-select v-model="searchForm.workflow" placeholder="请选择">
            <el-option
              v-for="item in workflowItems"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div
      style="width:550px;position:absolute; z-index: 1; top:0px;right:0;-webkit-box-shadow:1px 2px 15px #909090;-moz-box-shadow: 1px 2px 15px #909090; box-shadow:1px 2px 15px #909090;"
    >
      <div
        class="header"
        style="width:100%;height:30px;background-color:#20A0FF;padding-top:2px"
      >
        &nbsp;&nbsp;<span style="color:white;">异常消息框</span>
        <img
          class="updownImg"
          src="@/assets/images/map/updown.png"
          title="展开/收缩"
          @click="onDown"
          style="width:25px;height:25px;right:10px;position:absolute;cursor:pointer;padding-top:1px"
        />
      </div>
      <div
        v-if="alarmDialogVisible"
        style="width:100%;height:220px;background-color:white;padding-top:0px;"
      >
        <template>
          <el-table
            :data="alarmData"
            height="200"
            border
            style="font-size:8px;"
          >
            <el-table-column prop="idx" label="#" width="35"></el-table-column>
            <el-table-column
              prop="plate"
              label="车牌号"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="driver"
              label="司机"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="异常类型"
              width="70"
            ></el-table-column>
            <el-table-column
              prop="status"
              label="处理状态"
              width="70"
            ></el-table-column>
            <el-table-column
              prop="date"
              label="最后操作时间"
              width="135"
            ></el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap';
import AMapUI from 'AMapUI';
import * as screenfull from 'screenfull';
import '@/styles/custom.scss';
import fecha from 'fecha';
import {
  getPathData,
  getVehicleData
} from '@/api/OrderManagement1/onlineMonitor.js';
import { Message } from 'element-ui';
var map;
export default {
  name: 'OnlineMonitor',
  data() {
    return {
      mapHeight:
        this.$route.path == '/onlineMonitor'
          ? document.body.clientHeight
          : document.body.clientHeight - 84,
      alarmData: [],
      workflowItems: [
        {
          label: '在途',
          value: 1
        },
        {
          label: '已交付',
          value: 2
        },
        {
          label: '已回单',
          value: 3
        }
      ],
      searchForm: {
        bgnTime: '',
        endTime: '',
        workflow: 1
      },
      dialogVisible: false,
      colors: [
        '#3366cc',
        '#dc3912',
        '#ff9900',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
        '#b82e2e',
        '#316395',
        '#994499',
        '#22aa99',
        '#aaaa11',
        '#6633cc',
        '#e67300',
        '#8b0707',
        '#651067',
        '#329262',
        '#5574a6',
        '#3b3eac'
      ],
      globalMarkers: [],
      points: [],
      paths: [],
      datePickerValue: '',
      alarmDialogVisible: false
    };
  },
  methods: {
    init() {
      map = new AMap.Map('mapContainer', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 10
      });
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
      });
    },
    setPagePathsOnMap() {
      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], PathSimplifier => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！');
          return;
        }
        let this$ = this;
        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
              //point
              return pathData.name; //+ '，' + pathData.points[pointIndex].name
            }
          },
          renderOptions: {
            pathLineStyle: {
              dirArrowStyle: true //false
            },
            getPathStyle: function(pathItem, zoom) {
              let color =
                  this$.colors[pathItem.pathIndex % this$.colors.length],
                lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));

              return {
                pathLineStyle: {
                  strokeStyle: color,
                  lineWidth: lineWidth
                },
                pathLineSelectedStyle: {
                  lineWidth: lineWidth + 2
                },
                pathNavigatorStyle: {
                  fillStyle: color
                }
              };
            },
            startPointStyle: {
              radius: 6,
              fillStyle: '#109618',
              lineWidth: 2,
              strokeStyle: '#000000'
            },
            endPointStyle: {
              radius: 6,
              fillStyle: '#dc3912',
              lineWidth: 2,
              strokeStyle: '#000000'
            }
            // renderAllPointsIfNumberBelow:  //绘制路线节点，如不需要可设置为-1   //msg1.length
          }
        });
        pathSimplifierIns.setData(this.paths);
      });
    },
    setVehicleOnMap() {
      let this$ = this;
      AMapUI.loadUI(
        ['overlay/SimpleMarker', 'overlay/SimpleInfoWindow'],
        (SimpleMarker, SimpleInfoWindow, $) => {
          if (
            Object.prototype.toString.call(this.globalMarkers) !==
            '[object Array]'
          ) {
            this.globalMarkers = [];
          }
          for (let item of this.globalMarkers) {
            item.setMap(null);
          }
          var infoWindow = new AMap.InfoWindow({
            isCustom: false,
            draggable: true, //是否可拖动
            offset: new AMap.Pixel(1, 23),
            content: ''
          });
          let markers = [];
          if (
            Object.prototype.toString.call(this.points) !== '[object Array]'
          ) {
            this.points = [];
          }
          for (let point of this.points) {
            //车辆颜色判断
            let _img = require('@/assets/images/map/green.png');
            if (point.type == 1) {
              _img = require('@/assets/images/map/blue.png');
            } else if (point.type == 2) {
              //有异常未处理的
              _img = require('@/assets/images/map/red.png');
            }

            //解决位置相同问题
            var _Pixel1 = 0;
            var _Pixel2 = 30;
            if (point.flag !== 1) {
              _Pixel1 = 5 * point.flag;
              _Pixel2 = -10 * point.flag;
            }
            let marker = new SimpleMarker({
              map: map,
              iconStyle: _img,
              position: point.position,
              offset: new AMap.Pixel(_Pixel1, _Pixel2),
              label: {
                content:
                  '<span style="font-size:8px">' + point.plate + '</span>',
                offset: new AMap.Pixel(0, -21)
              }
            });
            marker.ordIdx = point.ordIdx;
            marker.clientNo = point.clientNo;
            marker.dirver = point.dirver + ' (' + point.tel + ')';
            marker.info = point.info;
            marker.plate = point.plate;
            marker.type = point.alarmText;
            //  marker.proPhase = point.handleText;
            marker.on('click', function(e) {
              infoWindow.setContent(
                `<div class="infowindow_class">
                  <p>客户订单号:&nbsp;<span>${e.target.clientNo}</span></p>
                  <p>车辆:&nbsp;<span>${e.target.plate}</span></p>
                  <p>司机:&nbsp;<span>${e.target.dirver}</span></p>  
                  <p>异常类型:&nbsp;<span>${
                    e.target.type
                  }</span></p>             
                  <p>当前地址:&nbsp;<span>${e.target.info}</span></p>
                </div>
                <div class="infowindow_class_">
                    <a style="cursor: pointer;" href="/vehicletrack?OrdIDX=${
                      e.target.ordIdx
                    }" target="_blank">
                      <img src="${require('@/assets/images/map/track.png')}">
                       <span>轨迹</span>&nbsp;&nbsp;
                    </a>
                    <a style="cursor: pointer;" href="/OrderManagement/exceptiondetail/${
                      e.target.ordIdx
                    }" target="_blank">
                       <img src="${require('@/assets/images/map/track.png')}">
                       <span>处理</span>
                   </a>
                </div>`
              );
              infoWindow.open(map, e.lnglat);
            });
            markers.push(marker);
          }
          this.globalMarkers = markers;
        }
      );
    },
    getAllMapData() {
      let data = {
        bgnTime: '',
        endTime: '',
        workflow: '1'
      };
      getVehicleData(data).then(res => {
        this.points = res.data.data.vehicles;
        this.alarmData = res.data.data.Alarms;
        this.setVehicleOnMap();
      });
      getPathData({})
        .then(res => {
          this.paths = res.data.data;
          this.setPagePathsOnMap();
        })
        .catch(res => {});
    },
    handleClose() {},
    onSubmit() {
      getVehicleData(this.searchForm).then(res => {
        this.points = res.data.data;
        this.setVehicleOnMap();
      });
    },
    onDown() {
      if (this.alarmDialogVisible == true) {
        this.alarmDialogVisible = false;
      } else {
        this.alarmDialogVisible = true;
      }
    },
    onDateChange(val) {
      //  this.searchForm.bgnTime = val;
      //  this.searchForm.endTime = val;
    }
  },
  mounted() {
    this.init();
    this.getAllMapData();
  }
};
</script>

<style lang="scss">
$color: blue;
.online-monitor {
  position: relative;
}

label {
  font-weight: normal;
}
.search-form-container {
  position: absolute;
  z-index: 1;
  top: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 5px;
  right: 0;
}
.search-form-container .el-select--mini {
  width: 100%;
}
.search-form-container .el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
.search-form-container .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.infowindow_class {
  p {
    font-size: 10px;
    font-family: 'Arial', 'Tahoma', '微软雅黑', '雅黑';
    height: 12px;
  }
  span {
    color: $color;
  }
}
.infowindow_class_ {
  padding-top: 20px;

  img {
    height: 13px;
    vertical-align: middle;
    margin: 0 2px 0 0;
  }
  span {
    font-size: 14px;
    color: #067ec0;
    text-decoration: underline;
  }
}

.updownImg:hover {
  top: 3px;
}
</style>
