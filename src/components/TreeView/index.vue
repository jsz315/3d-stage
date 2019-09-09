<template>
  <el-tree ref="tree" show-checkbox :data="sceneTree" node-key="uuid" :props="defaultProps" :default-expanded-keys="keys" :default-checked-keys="keys" :default-expand-all="false" :accordion="true" @node-click="handleNodeClick"></el-tree>
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
  
  @Provide() keys:string[] = [];

  mounted() {
    GameEvent.ins.on(GameEvent.OPEN_TREE_ITEM, (e:any) => {this.openTreeItem(e)});
  }

  handleNodeClick(e: any){
    GameEvent.ins.send(GameEvent.SELECT_TREE_ITEM, e.uuid);
  }

  openTreeItem(e:CustomEvent){
    (this.$refs.tree as any).setCheckedKeys([]);
    let uuid = e.detail;
    this.keys = [uuid];
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
