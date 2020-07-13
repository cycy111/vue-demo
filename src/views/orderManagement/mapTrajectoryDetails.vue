<template>
  <div class="mapTrajectoryDetails">
    <div ref="mapContainer"></div>
    <!-- <remote-js src="//webapi.amap.com/maps?v=1.4.6&key=6505ec512e5a72adec6a61b2b1b46535"></remote-js> -->
    <!-- <remote-js src="//webapi.amap.com/demos/js/liteToolbar.js"></remote-js> -->
    <!-- <remote-js src="//cache.amap.com/lbs/static/addToolbar.js"></remote-js> -->
    <!-- <remote-js src="//webapi.amap.com/ui/1.0/main.js?v=1.0.11"></remote-js> -->
  </div>
</template>
<script>
import { Message } from 'element-ui';
import { orderMapList } from '@/api/order';
import AMap from 'AMap';
import AMapUI from 'AMapUI';
// import GadMap from "@/utils/gadMap.js";
export default {
  name: 'mapTrajectoryDetails',
  //   components: {
  //     remoteJs: GadMap.components.remoteJs
  //   },
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this.gadMapStart();
    }, 800);
  },
  methods: {
    gadMapStart() {
      let params = this.$route.query;
      orderMapList({
        shipmentno: params.shipmentno,
        OrderNo: params.OrderNo,
        keyValue: 'orderlistmap',
        pageSize: 1,
        pageIndex: 1
      }).then(res => {
        if (res.data.data && res.data.data.OrderListMap.length) {
          this.initGadMaps(res.data.data.OrderListMap[0]);
          return;
        }
        Message({
          message: '该记录没有发现地图轨迹数据!',
          type: 'error',
          duration: 3 * 1000
        });
        // setTimeout(() => {
        //   window.close();
        // }, 3001);
      });
    },
    //初始化高德地图
    initGadMaps(mapData) {
      ///--------------------------
      this.$refs.mapContainer.setAttribute(
        'style',
        'height:' + document.body.clientHeight + 'px'
      );
      try {
        let trajectoryPathSimplifier = null,
          trajectoryMap = null;
        trajectoryMap = new AMap.Map(this.$refs.mapContainer);
        trajectoryMap.plugin('AMap.ToolBar', () => {
          let toolbar = new AMap.ToolBar();
          trajectoryMap.addControl(toolbar);
        });

        AMapUI.load(
          ['ui/misc/PathSimplifier', 'lib/$'],
          (PathSimplifier, $) => {
            if (!PathSimplifier.supportCanvas) return;
            trajectoryPathSimplifier = new PathSimplifier({
              zIndex: 100,
              autoSetFitView: true,
              map: trajectoryMap, //所属的地图实例
              getPath: (pathData, pathIndex) => {
                var paths = pathData.path,
                  lnglatList = [];
                for (var i = 0, len = paths.length; i < len; i++) {
                  lnglatList.push(paths[i].lnglat);
                }
                return lnglatList;
              },
              getHoverTitle: (pathData, pathIndex, pointIndex) => {
                if (pointIndex >= 0) {
                  return '轨迹 ->' + pathData.path[pointIndex].name;
                }
                return pathData.name + '，点数量' + pathData.path.length;
              },
              renderOptions: {
                renderAllPointsIfNumberBelow: mapData.path.length, //绘制路线节点，如不需要可设置为-1
                pathLineSelectedStyle: {
                  lineWidth: 6,
                  strokeStyle: '#225d98',
                  borderWidth: 1,
                  borderStyle: '#cccccc',
                  dirArrowStyle: true
                }
              }
            });
            //设置数据
            trajectoryPathSimplifier.setData([mapData]);
            var navg3 = trajectoryPathSimplifier.createPathNavigator(0, {
              loop: false,
              speed: 1000 * 100000, //越大越快
              pathNavigatorStyle: {
                autoRotate: false, //禁止调整方向
                pathLinePassedStyle: '#225d98',
                width: 24,
                height: 24,
                content: PathSimplifier.Render.Canvas.getImageContent(
                  './static/images/car-front.png'
                )
              }
            });
            navg3.start();
            //选中路线0
            trajectoryPathSimplifier.setSelectedPathIndex(0);
            trajectoryPathSimplifier.on('pointClick', function(e, info) {
              //console.log("Click: ", info);
            });
            //添加起点终点标记
            let markers = [
              {
                content:
                  '<div class="marker-route marker-marker-bus-from"></div>',
                position: mapData.fromAddress
              },
              {
                content:
                  '<div class="marker-route marker-marker-bus-end"></div>',
                position: mapData.toAddress
              }
            ];

            //设置起点终点图标
            AMap.plugin('AMap.Geocoder', () => {
              let geocoder = new AMap.Geocoder();
              markers.forEach((val, i) => {
                geocoder.getLocation(val.position, (status, result) => {
                  if (status === 'complete' && result.info === 'OK') {
                    new AMap.Marker({
                      //添加自定义点标记
                      map: trajectoryMap,
                      position: [
                        result.geocodes[0].location.lng,
                        result.geocodes[0].location.lat
                      ], //基点位置
                      offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
                      draggable: false, //是否可拖动
                      content: val.content //自定义点标记覆盖物内容
                    });
                  }
                });
              });
            });

            // markers.forEach(marker => {
            //   new AMap.Marker({
            //     //添加自定义点标记
            //     map: trajectoryMap,
            //     position: marker.position, //基点位置
            //     offset: new AMap.Pixel(-17, -42), //相对于基点的偏移位置
            //     draggable: false, //是否可拖动
            //     content: marker.content //自定义点标记覆盖物内容
            //   });
            // });
          }
        );
      } catch (error) {
        Message({
          message: '网络延迟，地图加载失败，请手动刷新后重试！',
          type: 'error',
          duration: 3 * 1000
        });
      }

      //显示工具条

      // let navgOne = trajectoryPathSimplifier.createPathNavigator(0, {
      //   autoSetFitView: true,
      //   loop: false,
      //   speed: 1000 * 1000, //越大越快
      //   pathNavigatorStyle: {
      //     autoRotate: false, //禁止调整方向
      //     pathLinePassedStyle: 'rgba(0,0,0,0)',
      //     width: 1,
      //     height: 1,
      //     content: PathSimplifier.Render.Canvas.getImageContent(
      //       "../static/images/car-front.png"
      //     ),
      //     strokeStyle: null,
      //     fillStyle: null
      //   }
      // });
      // navgOne.start();

      // if (!PathSimplifier.supportCanvas) {
      //   return alert("当前环境不支持 Canvas！");
      // }
      // var colors = [
      //   "#3366cc",
      //   "#dc3912",
      //   "#ff9900",
      //   "#109618",
      //   "#990099",
      //   "#0099c6",
      //   "#dd4477",
      //   "#66aa00",
      //   "#b82e2e",
      //   "#316395",
      //   "#994499",
      //   "#22aa99",
      //   "#aaaa11",
      //   "#6633cc",
      //   "#e67300",
      //   "#8b0707",
      //   "#651067",
      //   "#329262",
      //   "#5574a6",
      //   "#3b3eac"
      // ];
      // trajectoryPathSimplifier = new PathSimplifier({
      //   zIndex: 100,
      //   autoSetFitView: true,
      //   map: trajectoryMap,
      //   getPath: function(pathData, pathIndex) {
      // 	//   console.log(pathData,pathIndex,'这里是什么？')
      // 	// return pathData.path.lnglat;

      // 	var paths = pathData.path,lnglatList = [];
      //         for (var i = 0, len = paths.length; i < len; i++) {
      //             lnglatList.push(paths[i].lnglat);
      //         }

      //         return lnglatList;

      //   },
      //   getHoverTitle: function(pathData, pathIndex, pointIndex) {

      // 	  if (pointIndex >= 0) {
      //             return pathData.name + ',' + pathData.paths[pointIndex].name;
      //         }
      //         return pathData.name + ',点数量' + pathData.paths.length;
      //   },
      //   renderOptions: {
      // 	   renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
      //     // pathLineStyle: {
      //     //   dirArrowStyle: true
      //     // },
      //     getPathStyle: function(pathItem, zoom) {
      //       var color = colors[pathItem.pathIndex % colors.length],
      //         lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));
      //       return {
      //         pathLineStyle: {
      //           strokeStyle: color,
      //           lineWidth: lineWidth + 1
      //         },
      //         pathLineSelectedStyle: {
      //           lineWidth: lineWidth + 1
      //         },
      //         pathNavigatorStyle: {
      //           fillStyle: color
      //         }
      //       };
      //     }
      //   }
      // });

      // trajectoryPathSimplifier.setData([pathData]); //../static/car-front.png
      // let navgOne = trajectoryPathSimplifier.createPathNavigator(0, {
      //   autoSetFitView: true,
      //   loop: false,
      //   speed: 1000 * 1000, //越大越快
      //   pathNavigatorStyle: {
      //     autoRotate: false, //禁止调整方向
      //     pathLinePassedStyle: "#225d98",
      //     width: 24,
      //     height: 24,
      //     content: PathSimplifier.Render.Canvas.getImageContent(
      //       "../static/images/car-front.png"
      //     ),
      //     strokeStyle: null,
      //     fillStyle: null
      //   }
      // });
      // navgOne.start();
    }
  }
};
</script>
<style>
.amap-marker .marker-route {
  position: absolute;
  width: 40px;
  height: 44px;
  color: #e90000;
  background: url('~@/assets/images/poi-1.png') no-repeat;
  cursor: pointer;
}
.amap-marker .marker-marker-bus-from {
  background-position: -334px -180px;
}
.amap-marker .marker-marker-bus-end {
  background-position: -334px -138px;
}
</style>
