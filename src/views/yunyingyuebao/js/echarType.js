//本月出入库对比情况 柱状图 this.$refs['echart'+item][0]
import echarts from 'echarts';
export function monthlyComparisonLine(refs, echarItemData) {
  echarItemData.series[0].type = 'line';
  var max;
  if (echarItemData.title && echarItemData.title.indexOf('率') > -1) {
    max = 1;
  }
  if (echarItemData.series && echarItemData.series.length) {
    echarItemData.series[0].label = {
      normal: {
        show: true,
        position: 'top'
      }
    };
  }
  var option = {
    title: {
      text: echarItemData.title,

      left: 'center'
    },
    xAxis: {
      name: '',
      type: 'category',
      boundaryGap: true,
      data: echarItemData.xAxis
    },
    tooltip: {
      trigger: 'axis'
    },
    yAxis: {
      max: max,
      axisLabel: {
        formatter: '{value}'
      },
      type: 'value'
    },
    grid: {
      left: 80
    },
    series: echarItemData.series
  };
  if (
    !(
      option &&
      option.series &&
      option.series[0] &&
      option.series[0].data.length
    )
  ) {
    // return;
  }
  let hasData = false;
  for (let item of option.series[0].data) {
    if (item && item != '0' && item != '0.000') {
      hasData = true;
    }
  }
  if (!hasData) {
    // return;
  }
  echarts.init(refs).setOption(option);
}

//本月出入库，柱状图
export function monthlyComparisonBar(refs, echarItemData) {
  //清洗数据
  echarItemData.series.forEach(item => {
    item.type = 'bar';
  });
  let titleLeft = echarItemData.titleLeft || 'left';
  var option = {
    title: {
      text: echarItemData.title,
      left: 'center'
    },
    legend: {
      data: echarItemData.legend,
      bottom: '0px'
    },
    xAxis: [
      {
        type: 'category',
        data: echarItemData.xAxis
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: echarItemData.series,
    label: {
      normal: {
        show: true,
        position: 'top',
        textStyle: {
          color: 'black'
        }
      }
    }
  };
  if (
    !(
      option &&
      option.series &&
      option.series[0] &&
      option.series[0].data.length
    )
  ) {
    // return;
  }
  let hasData = false;
  for (let item of option.series[0].data) {
    if (item && item != '0' && item != '0.000') {
      hasData = true;
    }
  }
  if (!hasData) {
    // return;
  }
  echarts.init(refs).setOption(option);

  // echarts.init(refs).setOption({
  // 	title : {
  // 		text: '本月出入库金额对比',
  // 		subtext:'本月出入库金额对比'
  // 	},
  // 	legend: {
  // 		data:['工程物资','市场物资']
  // 	},
  // 	xAxis : [
  // 		{
  // 			type : 'category',
  // 			data : ['工程物资','市场物资']
  // 		}
  // 	],
  // 	yAxis : [
  // 		{
  // 			type : 'value'
  // 		}
  // 	],
  // 	series : [
  // 		{
  // 			name:'入库金额',
  // 			type:'bar',
  // 			data:[2.0, 4.9]
  // 		},
  // 		{
  // 			name:'出库金额',
  // 			type:'bar',
  // 			data:[2.6, 5.9]
  // 		},

  // 	]
  // });
}

//仓库总体单据情况
export function monthlyComparisonVerticalBar(refs, echarItemData) {
  echarItemData.series.forEach(item => {
    item.type = 'bar';
  });
  var option = {
    title: {
      text: echarItemData.title,
      left: echarItemData.titleAlign || 'left'
    },
    legend: {
      data: [echarItemData.title]
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        boundaryGap: [0, 0.1]
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: echarItemData.xAxis
      }
    ],
    series: echarItemData.series,
    label: {
      normal: {
        show: true,
        position: 'right',
        textStyle: {
          color: 'black'
        }
      }
    }
  };
  if (
    !(
      option &&
      option.series &&
      option.series[0] &&
      option.series[0].data.length
    )
  ) {
    // return;
  }
  let hasData = false;
  for (let item of option.series[0].data) {
    if (item && item != '0' && item != '0.000') {
      hasData = true;
    }
  }
  if (!hasData) {
    // return;
  }
  echarts.init(refs).setOption(option);
}

//仓库面积
export function monthlyCircle(refs, option) {
  if (
    !(
      option &&
      option.series &&
      option.series[0] &&
      option.series[0].data.length
    )
  ) {
    // return;
  }
  let hasData = false;
  for (let item of option.series[0].data) {
    if (item && item != '0' && item != '0.000') {
      hasData = true;
    }
  }
  if (!hasData) {
    // return;
  }
  echarts.init(refs).setOption(option);
}

export function echartCommon(refs, option) {
  if (
    !(
      option &&
      option.series &&
      option.series[0] &&
      option.series[0].data.length
    )
  ) {
    // return;
  }
  let hasData = false;
  for (let item of option.series[0].data) {
    if (item && item != '0' && item != '0.000') {
      hasData = true;
    }
  }
  if (!hasData) {
    // return;
  }
  echarts.init(refs).setOption(option);
}
