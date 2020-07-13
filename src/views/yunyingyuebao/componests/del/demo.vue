<template>
  <div class="ne-ipt">
    <input type="text" v-model="currentValue" />
  </div>
</template>

<script>
export default {
  name: 'NeIpt',
  props: {
    // 接收一个由父级组件传递过来的值
    value: {
      type: String,
      default: function() {
        return '';
      }
    }
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get: function() {
        return this.value; // 将props中的value赋值给currentValue
      },
      set: function(val) {
        this.$emit('input', val); // 通过$emit触发父组件
      }
    }
  }
};
</script>
