<template>
  <div class="stage">
    <p class="info">Q-坐标系 | W-移动 | E-旋转 | R-缩放</p>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/core/Game"; // @ is an alias to /src
import GameEvent from "@/core/event/index";
import ParamTooler from '@/core/tool/ParamTooler';
import {Stats} from '@/core/tool/Stats';

let game:Game;
let dataList: any;
let stats:any;

@Component
export default class Stage extends Vue {
  @Prop() private msg!: string

  mounted() {
    game = new Game(this.$refs.canvas);
    
    (<any>this.$refs.canvas).addEventListener("mouseenter", this.mouseenter);

    //threejs发过来的消息
    // GameEvent.ins.on(GameEvent.SELECT_ITEM, (e:any) => {this.changeSelectItem(e)});
    // GameEvent.ins.on(GameEvent.SELECT_LIGHT, (e:any) => {this.changeSelectLight(e)});

    GameEvent.ins.on(GameEvent.ITEM_INFO, (e:any) => {this.changeItemInfo(e)});
    GameEvent.ins.on(GameEvent.FAIL_COMPUTE, (e:any) => {this.failCompute(e)});

    
    
    // GameEvent.ins.on(GameEvent.CHANGE_TRANSFORM, (e:any) => {this.changeCurTransform(e)});

    //vue组件发过来的消息
    // GameEvent.ins.on(GameEvent.CHANGE_PARAM, (e:any) => {this.changeItemParam(e)});
    // GameEvent.ins.on(GameEvent.CHANGE_TRANSFORM, (e:any) => {this.changeItemTransform(e)});
    GameEvent.ins.on(GameEvent.CHANGE_MATERIAL, (e:any) => {this.changeMaterial(e)});
    
    GameEvent.ins.on(GameEvent.DELETE_TEXTURE, (e:any) => {this.deleteTexture(e)});
    GameEvent.ins.on(GameEvent.DELETE_ITEM, (e:any) => {this.deleteItem(e)});
    GameEvent.ins.on(GameEvent.COPY_ITEM, (e:any) => {this.copyItem(e)});

    GameEvent.ins.on(GameEvent.ADD_LIGHT, (e:any) => {this.addLight(e)});

    GameEvent.ins.on(GameEvent.CUSTOM_GEOMETRY, (e:any) => {this.addCustomGeometry(e)});
    GameEvent.ins.on(GameEvent.MAKE_GROUP, (e:any) => {this.makeGroup(e)});
    GameEvent.ins.on(GameEvent.SPLIT_GROUP, (e:any) => {this.splitGroup(e)});
    // GameEvent.ins.on(GameEvent.CHANGE_IS_ROOT, (e:any) => {this.changeIsRoot(e)});

    GameEvent.ins.on(GameEvent.GET_SCENE_TREE, (e:any) => {this.getSceneTree(e)});
    GameEvent.ins.on(GameEvent.SELECT_TREE_ITEM, (e:any) => {this.selectTreeItem(e)});

    GameEvent.ins.on(GameEvent.CHANGE_ITEM_NAME, (e:any) => {this.changeItemName(e)});


    GameEvent.ins.on(GameEvent.BSP_SUBTRACT, (e:any) => {this.bspSubtract(e)});
    GameEvent.ins.on(GameEvent.BSP_INTERSECT, (e:any) => {this.bspIntersect(e)});
    GameEvent.ins.on(GameEvent.BSP_UNION, (e:any) => {this.bspUnion(e)}); 

    GameEvent.ins.on(GameEvent.EXPORT_SCENE, (e:any) => {this.handleExport(e)}); 
    GameEvent.ins.on(GameEvent.LOAD_SCENE, (e:any) => {this.handleTest(e)}); 
    GameEvent.ins.on(GameEvent.TOGGLE_STATS, (e:any) => {this.handleStats(e)}); 
    GameEvent.ins.on(GameEvent.IMPORT_SCENE, (e:any) => {this.handleFile(e)}); 
    

    //Paramview组件发过来的消息
    GameEvent.ins.on(GameEvent.CHANGE_ITEM_PARAM, (e:any) => {this.changeItemParam(e)});

    this.initStats();

  }

  initStats(){
    stats = new Stats();
    stats.setMode(0); 
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '204px';
    stats.domElement.style.top = '90px';
    document.body.appendChild(stats.domElement);
    
    game.setStats(stats);
  }

  addLight(e: any){
    game.addLight(e.detail);
  }

  changeMaterial(e: any){
    game.toggerMaterial(e.detail);
  }

  deleteTexture(e:any){
    game.deleteTexture(e.detail);
  }

  changeItemParam(e: any){
    console.log("Paramview组件发过来的消息");
    console.log(e.detail);
    let value = e.detail.value;
    let list = e.detail.name.split(".");
    let type = list[0];

    if(type == "geometry"){
      let param:any = Object.assign(this.$store.state.curParam, {});
      param[list[1]] = Number(value);
      game.changeGeometryParam(param);
      // this.$store.commit("changeCurParams", param);
    }
    else if(type == "position" || type == "rotation" || type == "scale"){
      let transform:any = Object.assign(this.$store.state.transform, {});
			transform[type][list[1]] = Number(value);
      game.changeItemTransform(transform);
      // this.$store.commit("changeCurTransform", transform);
    }
    else if(type == "material"){
      let material = Object.assign(this.$store.state.curMaterial, {});
      if(ParamTooler.checkMap(list[1])){
        if(list[2] == "image"){
          game.changeTextureMaterial(list[1], value);
        }
        else{
          game.changeRepeatMaterial(list[1], list[2], value);
        }
        if(!material[list[1]]){
          material[list[1]] = {};
        }
        material[list[1]][list[2]] = value;
      }
      else{
        material[list[1]] = value;
        game.changeCommonMaterial(list[1], value);
      }
    }
    else if(type == "light"){
      game.changeLightParam(list[1], value);
    }
    else if(type == "scene"){
      let data = Object.assign(this.$store.state, {});
      let parameters = data.parameters;
      parameters[list[1]] = value;
      this.$store.commit("changeItemInfo", [data]);
      game.changeScene(parameters);
    }
  }

  deleteItem(e: any){
    game.deleteItem();
  }

  copyItem(e: any){
    game.copyItem();
  }

  mouseenter(e:MouseEvent):void{
    if(this.$store.state.dragItem){
      game.addObject(this.$store.state.dragItem.name, e);
    }
  }

  changeSelectItem(e:CustomEvent):void{
    this.$store.commit("changeCurItemName", e.detail.name);
    this.$store.commit("changeCurDragType", "mesh");
    this.$store.commit("changeDrawer", true);
    this.$store.commit("changeMaterialType", e.detail.materialType);
    this.$store.commit("changeCurMaterial", e.detail.material);
    this.$store.commit("changeCurParams", e.detail.parameters);
    this.$store.commit("changeCurTransform", e.detail.transform);
  }

  changeSelectLight(e:CustomEvent):void{
    this.$store.commit("changeCurItemName", e.detail.name);
    this.$store.commit("changeCurDragType", "light");
    this.$store.commit("changeDrawer", true);
    this.$store.commit("changeCurParams", e.detail.parameters);
    this.$store.commit("changeCurTransform", e.detail.transform);
  }

  changeItemInfo(e:CustomEvent):void{
    dataList = e.detail;
    this.$store.commit("changeItemInfo", dataList);
    this.$store.commit("changeDrawer", true);
  }

  changeCurTransform(e:CustomEvent):void{
    this.$store.commit("changeCurTransform", e.detail);
  }

  handleFile(e:CustomEvent):void{
    console.log(e);
    var reader = new FileReader();
      reader.readAsArrayBuffer(e.detail);
      reader.onload = (r) => {
          console.info(reader.result);
          var rs = new DataView(reader.result as ArrayBuffer);
          console.log(rs);
          game.loadObject(rs.buffer);
      }
  }

  handleTest(e:CustomEvent):void{
    game.loadTest();
    // game.testGltfLoad();
  }

  handleStats(e:CustomEvent):void{
    let s = stats.domElement.style;
    console.log(s);
    if(s.display == "none"){
      s.display = "block";
    }
    else{
      s.display = "none";
    }
  }

  handleExport(e:CustomEvent){
    // game.exportTest();

    let type = e.detail;
    if(type == 1){
      game.standardExport(true);
    }
    else if(type == 2){
      game.standardExport(false);
    }
    else if(type == 3){
      game.customExport(true);
    }
    else if(type == 4){
      game.customExport(false);
    }
  }

  addCustomGeometry(e:CustomEvent):void{
    game.addCustomGeometry(e.detail);
  }

  makeGroup(e:CustomEvent):void{
    game.makeGroup();
  }

  splitGroup(e:CustomEvent):void{
    game.splitGroup();
  }

  getSceneTree(e:CustomEvent):void{
    let s = game.getSceneTree();
    console.log("game getSceneTree");
    console.log(s);
    this.$store.commit("changeSceneTree", [s]);
  }

  selectTreeItem(e:CustomEvent):void{
    game.selectedItemByUUID(e.detail);
  }

  changeItemName(e:CustomEvent):void{
    game.changeItemName(e.detail);
  }

  bspSubtract(e:CustomEvent):void{
    game.bspSubtract();
  }

  bspIntersect(e:CustomEvent):void{
    game.bspIntersect();
  }

  bspUnion(e:CustomEvent):void{
    game.bspUnion();
  }

  failCompute(e:CustomEvent):void{
    this.$message(e.detail);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
