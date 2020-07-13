<template>
  <div class="vehicle-track">
    <div
      id="mapContainer"
      class="map-container"
      :style="'height:' + mapHeight + 'px'"
    >
      <div id="loadingTip">加载数据，请稍候...</div>
    </div>
    <div class="alarm">
      <el-card class="box-card">
        <div slot="header" class="clearfix"><span>温馨提示</span></div>
        <div class="text">
          <div v-if="alarmText">
            <p>紧急通知</p>
            <p>{{ alarmText }}</p>
          </div>

          <div v-if="!alarmText">
            <img src="@/assets/images/map/noneAlarm.png" class="image" />
            <p style="color:black">恭喜您，车辆暂无警报</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap';
import AMapUI from 'AMapUI';
import * as screenfull from 'screenfull';
import '@/styles/custom.scss';
import { getRoadVehicleTrack } from '@/api/OrderManagement1/vehicleTrack.js';
var map;
export default {
  name: 'VehicleTrack',
  data() {
    return {
      mapHeight:
        this.$route.path == '/vehicleTrack'
          ? document.body.clientHeight
          : document.body.clientHeight - 84,
      alarm: [],
      vehicle: [],
      path: [],
      endPoints: [],
      isDelivery: '',
      offset_dis: '',
      al_prophase: '',
      alarmText: ''
    };
  },
  methods: {
    init() {
      map = new AMap.Map('mapContainer', {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 1
      });
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function() {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
      });
    },
    getAllMapData() {
      let data = {
        ordIdx: this.$route.query.OrdIDX
      };
      getRoadVehicleTrack(data).then(res => {
        this.alarm = res.data.data.alarm;
        this.vehicle = res.data.data.vehicle;
        this.path = res.data.data.path;
        this.endPoints = res.data.data.endPoints;
        this.isDelivery = res.data.data.isDelivery;
        this.setRoadVehicleTrack();
      });
    },
    setRoadVehicleTrack() {
      let this$ = this;
      //预警
      var allAlarm = '';
      if (this$.alarm !== null) {
        for (var i = 0; i < this$.alarm.length; i++) {
          var al_alarm = this$.alarm[i];
          let handleText = '';
          //异常
          if (al_alarm.al_type == '0') {
            continue;
          } else if (al_alarm.al_type == '1') {
            handleText = '车辆偏离,';
          } else if (al_alarm.al_type == '2') {
            handleText = '胎压异常,';
          } else if (al_alarm.al_type == '3') {
            handleText = '驾驶疲劳,';
          } else if (al_alarm.al_type == '4') {
            handleText = '行驶超速,';
          }
          //处理状态
          if (al_alarm.al_prophase == '') {
            handleText += '请及时处理!';
          } else if (al_alarm.al_prophase == '未处理') {
            handleText += '已提交单据,请及时处理！';
          } else if (al_alarm.al_prophase == '处理中') {
            handleText += '正在处理中,请耐心等待！';
          } else if (al_alarm.al_prophase == '已处理') {
            handleText += '已处理完毕,恭喜已完成！';
          }
          allAlarm += handleText;
        }
      }
      this.alarmText = allAlarm;
      // if(isDelivery<1) //路径规划
      // {
      //     var driving = new AMap.Driving({ map: map,hideMarkers:true,showTraffic:false});
      //     driving.search(msg1[msg1.length-1].lnglat,msg2[msg2.length-1].lnglat);
      // }
      //轨迹展示
      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(
        PathSimplifier,
        $
      ) {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！');
          return;
        }
        var pathSimplifierIns = new PathSimplifier({
          zIndex: 100, //autoSetFitView:false,
          autoSetFitView: true,
          map: map, //所属的地图实例
          getPath: function(pathData, pathIndex) {
            var lnglatList = [];
            for (var i = 0, len = pathData.points.length; i < len; i++) {
              lnglatList.push(pathData.points[i].lnglat);
            }
            return lnglatList;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
              //point
              return pathData.name + '，' + pathData.points[pointIndex].name;
            }
          },
          renderOptions: {
            pathLineStyle: {
              lineWidth: 3,
              strokeStyle: '#55189b',
              borderWidth: 2,
              borderStyle: '#2d0808',
              dirArrowStyle: false
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
            },
            renderAllPointsIfNumberBelow: this$.vehicle.length //绘制路线节点，如不需要可设置为-1
          }
        });

        window.pathSimplifierIns = pathSimplifierIns;

        //设置数据
        var pathIndex = null;
        if (this$.path.length > 0) {
          pathSimplifierIns.setData([
            { name: '标准路线', points: this$.path },
            { name: '已行驶轨迹', points: this$.vehicle }
          ]);
          pathIndex = 1;
        } else {
          pathSimplifierIns.setData([
            { name: '已行驶轨迹', points: this$.vehicle }
          ]);
          pathIndex = 0;
        }
        $('#loadingTip').remove();
        //选中路线0
        pathSimplifierIns.setSelectedPathIndex(pathIndex);
        var navg1 = pathSimplifierIns.createPathNavigator(pathIndex, {
          loop: false,
          speed: 10000000,
          pathNavigatorStyle: {
            content: PathSimplifier.Render.Canvas.getImageContent(
              require('@/assets/images/map/green.png'),
              onload,
              onerror
            ),
            pathLinePassedStyle: null,
            autoRotate: false,
            width: 30,
            height: 30,
            strokeStyle: null,
            fillStyle: null
          }
        });
        navg1.start();
      });
      //起点/终点
      if (this$.path !== null && this$.path.length > 0) {
        var marker1 = new AMap.Marker({
          position: this$.path[0].lnglat,
          // title:this$.path[0].name,//鼠标滑过显示内容
          label: 'hfdsk',
          icon: new AMap.Icon({
            size: new AMap.Size(40, 50),
            image: require('@/assets/images/map/poi_start.png')
          })
        });
        marker1.setMap(map);
        marker1.setLabel({
          offset: new AMap.Pixel(35, 15),
          content: '<div>' + this$.path[0].name + '</div>'
        });

        var marker2 = new AMap.Marker({
          position: this$.path[this$.path.length - 1].lnglat,
          icon: new AMap.Icon({
            size: new AMap.Size(40, 50),
            image: require('@/assets/images/map/poi_stop.png'),
            imageOffset: new AMap.Pixel(3, 0)
          })
        });
        marker2.setMap(map);
        marker2.setLabel({
          offset: new AMap.Pixel(35, 15),
          content: this$.path[this$.path.length - 1].name
        });
      }
    }
  },
  created() {},
  mounted() {
    this.init();
    this.getAllMapData();
  }
};
</script>

<style lang="scss">
.map-container {
  font-family: 'Arial', 'Tahoma', '微软雅黑', '雅黑';
}
/*********加载*********/
#loadingTip {
  position: absolute;
  z-index: 9999;
  top: 0;
  left: 0;
  padding: 3px 10px;
  background: red;
  color: #fff;
  font-size: 14px;
}
.alarm {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  .box-card {
    width: 260px;
  }
}
//@import url("//unpkg.com/element-ui@2.4.11/lib/theme-chalk/index.css");

.el-card__header {
  background-color: #20a0ff;
  color: #ffffff;
  vertical-align: middle;
  padding: 5px;
}
.text {
  font-size: 14px;
  vertical-align: middle;
  text-align: center;
  color: red;
}
</style>
