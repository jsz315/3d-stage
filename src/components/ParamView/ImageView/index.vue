<template>
  <div class="image-view">
    <div class="param">

      <div class="state">
        <div class="label">{{label}}:</div>
        <div class="img" v-if="value" :style="{'background-image': 'url(' + value + ')'}" @click="handleChange"></div>
        <div class="choose"><i class="el-icon-picture-outline"></i> 修改</div>
        <div class="delete"><i class="el-icon-delete"></i> 删除</div>
      </div>

    </div>
  </div>
</template>

<script>
import GameEvent from "@/event/index";

export default {
  data() {
    return {
    };
  },
  props: ["label", "value", "pname"],
  computed: {},

  mounted() {},

  methods: {
    handleChange(e) {
      this.$emit("change", this.pname, !this.value);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>