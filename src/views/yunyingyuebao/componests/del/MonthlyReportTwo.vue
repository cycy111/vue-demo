<template>
  <div class="kpi-one">
    <h2>{{ title }}</h2>

    <el-table
      border
      show-header
      :data="data"
      style="width: 100%;margin:10px 0px;"
      :header-cell-style="{ background: '#F5F7FA' }"
    >
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
    <ul class="echartContainer">
      <li ref="echartOne"></li>
      <li ref="echartTwo"></li>
      <li ref="echartThree"></li>
    </ul>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="本月小结（填写样板：本月入库多于出库，导致库存积压，周转率低下，望各单位及时领用。)"
      v-model="textareaValue"
    ></el-input>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'MonthlyReportTwo',
  props: {
    title: {
      type: String,
      default: '一、KPI指标情况'
    }
  },
  data() {
    return {
      data: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    };
  },
  computed: {
    textareaValue: {
      get: function() {
        return '';
      },
      set: function(val) {
        this.$emit('input', val);
      }
    }
  },
  mounted() {
    let echartOne = echarts.init(this.$refs.echartOne);
    let echartTwo = echarts.init(this.$refs.echartTwo);
    let echartThree = echarts.init(this.$refs.echartThree);
    let option1 = {
      title: {
        text: '周转率',
        subtext: '...'
      },
      legend: {
        data: ['销量']
      },
      xAxis: {
        name: '',
        type: 'category',
        boundaryGap: true,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        axisLabel: {
          formatter: '{value}'
        },
        max: 15,
        type: 'value'
      },
      series: [
        {
          name: '',
          type: 'line',
          symbol: 'circle', //折线拐点去掉圆点
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              offset: [-10, 0],
              textStyle: {
                //拐点上标字体大小颜色
                color: '#f23030',
                fontSize: '17'
              }
            }
          },
          areaStyle: {
            normal: {
              color: '#E7F2FB'
            }
          },
          itemStyle: {
            normal: {
              color: '#000' //点颜色
            }
          },
          lineStyle: {
            normal: {
              color: '#FE8500'
            }
          },
          data: [3, 2, 3, 4, 5, 6, 7]
        }
      ]
    };

    let option2 = {
      title: {
        text: '呆滞率',
        subtext: '...'
      },
      legend: {
        data: ['销量']
      },
      xAxis: {
        name: '',
        type: 'category',
        boundaryGap: true,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        axisLabel: {
          formatter: '{value}'
        },
        max: 15,
        type: 'value'
      },
      series: [
        {
          name: '',
          type: 'line',
          symbol: 'circle', //折线拐点去掉圆点
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              offset: [-10, 0],
              textStyle: {
                //拐点上标字体大小颜色
                color: '#f23030',
                fontSize: '17'
              }
            }
          },
          areaStyle: {
            normal: {
              color: '#E7F2FB'
            }
          },
          itemStyle: {
            normal: {
              color: '#000' //点颜色
            }
          },
          lineStyle: {
            normal: {
              color: '#FE8500'
            }
          },
          data: [3, 2, 3, 4, 5, 6, 7]
        }
      ]
    };
    let option3 = {
      title: {
        text: '库存金额（万）',
        subtext: '...'
      },
      legend: {
        data: ['销量']
      },
      xAxis: {
        name: '',
        type: 'category',
        boundaryGap: true,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      tooltip: {
        trigger: 'axis'
      },
      yAxis: {
        axisLabel: {
          formatter: '{value}'
        },
        max: 15,
        type: 'value'
      },
      series: [
        {
          name: '',
          type: 'line',
          symbol: 'circle', //折线拐点去掉圆点
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top',
              offset: [-10, 0],
              textStyle: {
                //拐点上标字体大小颜色
                color: '#f23030',
                fontSize: '17'
              }
            }
          },
          areaStyle: {
            normal: {
              color: '#E7F2FB'
            }
          },
          itemStyle: {
            normal: {
              color: '#000' //点颜色
            }
          },
          lineStyle: {
            normal: {
              color: '#FE8500'
            }
          },
          data: [3, 2, 3, 4, 5, 6, 7]
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    echartOne.setOption(option1);
    // echartTwo.setOption(option2);
    // echartThree.setOption(option3);
  }
};
</script>
<style lang="scss">
.kpi-one h2 {
  text-align: left;
}
.echartContainer {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  li {
    list-style: none;
    width: 30%;
    height: 260px;
    &:nth-child(2) {
      margin: 0px 5%;
    }
  }
}
</style>
