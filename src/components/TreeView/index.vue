<template>
  <el-tree show-checkbox :data="sceneTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import GameEvent from "@/core/event/index";

@Component({
  components: {
    
  }
})
export default class LeftSide extends Vue {

  @Provide() defaultProps:object = {
                children: 'children',
                label: 'name'
              }

  mounted() {
    
  }

  handleNodeClick(e: any){
    GameEvent.ins.send(GameEvent.SELECT_TREE_ITEM, e.uuid);
  }

  get sceneTree():any{
    return this.$store.state.sceneTree;
  }
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
