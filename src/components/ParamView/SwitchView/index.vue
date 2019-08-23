<template>
  <div class="switch-view">
    <div class="param">

      <div class="state">
        <div class="label">{{label}}:</div>
        <div class="color" :class="{'active': value}" @click="handleChange">
          <div class="bar"></div>
        </div>
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