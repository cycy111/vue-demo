<template>
  <div>
    <ul class="echartContainer">
      <li
        :ref="`echart${item}`"
        v-for="(item, index) in echartsData"
        :key="index"
      ></li>
    </ul>
  </div>
</template>

<script>
import echarts from 'echarts';
import {
  monthlyComparisonLine,
  monthlyComparisonBar,
  monthlyComparisonVerticalBar,
  echartCommon
} from '../js/echarType.js';
export default {
  name: 'echarts',
  props: {
    echartsData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  filters: {},
  computed: {},
  methods: {
    getReport() {
      if (this.echartsData && this.echartsData.length) {
        this.echartsData.forEach((item, i) => {
          //console.log(item);
          if (!item) {
            return;
          }
          switch (item.model) {
            case 'orderInfo':
              item.titleAlign = 'center';
              monthlyComparisonVerticalBar(
                this.$refs['echart' + item][i],
                item
              );
              break;
            case 'kpiData':
              monthlyComparisonLine(this.$refs['echart' + item][i], item);
              break;
            default:
              echartCommon(this.$refs['echart' + item][i], item);
            // default:
            //   monthlyComparisonBar(this.$refs["echart" + item][i], item);
            //   break;
          }
        });
      }
    }
  },
  mounted() {
    this.getReport();
  }
};
</script>
<style lang="scss">
.echartContainer {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  li {
    list-style: none;
    width: 32%;
    height: 260px;
    // box-shadow: 0 4px 12px 0 rgba(0,0,0,.1);
    &:nth-child(2) {
      margin: 0px 2%;
    }
  }
}
</style>
