<template>
  <div class="compute-view">
    <el-button-group>
      <el-button type="small" @click="handleCompute('subtract')">subtract</el-button>
      <el-button type="small" @click="handleCompute('intersect')">intersect</el-button>
      <el-button type="small" @click="handleCompute('union')">union</el-button>
    </el-button-group>
  </div>
</template>

<script>
import GameEvent from "@/core/event/index";

export default {
		data() {
			return {

			};
		},
		components: {
		  
    },
    computed: {
      fog(){
        return this.$store.state.fog;
      }
    },
    methods: {
      handleCompute(m){
        let type = [GameEvent.BSP_SUBTRACT, GameEvent.BSP_INTERSECT, GameEvent.BSP_UNION];
        let list = ["subtract", "intersect", "union"];
        let n = list.indexOf(m);
        GameEvent.ins.send(type[n], null);
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
