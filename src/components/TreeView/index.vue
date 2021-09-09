<template>
  <Treeview :list="sceneTree" :nodeClick="onNodeClick" ref="tree" :uuid="uuid"></Treeview>
  <!-- <el-tree ref="tree" show-checkbox :data="sceneTree" node-key="uuid" :props="defaultProps" :default-expanded-keys="keys" :default-checked-keys="keys" :default-expand-all="false" :accordion="true" @node-click="handleNodeClick"></el-tree> -->
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import GameEvent from "@/core/event/index";
import Treeview from '../tree-view/index.vue';
@Component({
  components: {
    Treeview
  }
})
export default class LeftSide extends Vue {

  @Provide() defaultProps:object = {
                children: 'children',
                label: 'name'
              }
  
  @Provide() keys:string[] = [];

  mounted() {
    GameEvent.ins.on(GameEvent.OPEN_TREE_ITEM, (e:any) => {
      console.log("choose view", e)
      // this.openTreeItem(e);
      this.$store.commit("changeUuid", e.detail);
    });
  }

  handleNodeClick(e: any){
    GameEvent.ins.send(GameEvent.SELECT_TREE_ITEM, e.uuid);
  }

  openTreeItem(e:CustomEvent){
    // (this.$refs.tree as any).setCheckedKeys([]);
    // let uuid = e.detail;
    // this.keys = [uuid];
  }

  onNodeClick(item: any){
    console.log("node click", item);
    if(item.hide){
      item.hide = false;
    }
    else{
      this.$set(item, "hide", true);
    }

    this.$store.commit("changeUuid", item.uuid);
    GameEvent.ins.send(GameEvent.SELECT_TREE_ITEM, item.uuid);
  }

  get sceneTree():any{
    console.log("sceneTree", this.$store.state.sceneTree)
    return this.$store.state.sceneTree;
  }

  get uuid(){
    return this.$store.state.uuid;
  }
 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
