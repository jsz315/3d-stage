<template>
  <div class="fog-view">
    <ProtoView label="fog" :list="fog"></ProtoView>
  </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import ProtoView from "@/components/ProtoView/index.vue";

export default {
		data() {
			return {

			};
		},
		components: {
		  ProtoView
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
