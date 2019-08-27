<template>
  <div class="fog-view">
    <TransformView label="fog" :list="fog"></TransformView>
  </div>
</template>

<script>
import GameEvent from "@/event/index";
import TransformView from "@/components/TransformView/index.vue";

export default {
		data() {
			return {

			};
		},
		components: {
		  TransformView
    },
    computed: {
      fog(){
        return this.$store.state.fog;
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
