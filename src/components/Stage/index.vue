<template>
  <div class="stage">
    <div class="btns">
      <input ref="file" class="file" type="file" @change="handleFile"/>
      <el-button type="primary" icon="el-icon-sold-out" @click="handleLoad">加载模型</el-button>
      <el-button type="primary" icon="el-icon-position" @click="handleSave">导出模型</el-button>
      <el-button type="primary" icon="el-icon-position" @click="handleTest">测试</el-button>
      <el-button type="primary" icon="el-icon-position" @click="handleCustomGeometry">自定义模型</el-button>
      
    </div>
    <p class="info">Q-坐标系 | W-移动 | E-旋转 | R-缩放 | G-参考线</p>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/core/Game"; // @ is an alias to /src
import GameEvent from '@/event/index'
import ParamTooler from '../../core/ParamTooler';
import {Stats} from '../../core/Stats';

let game:Game;

@Component
export default class Stage extends Vue {
  @Prop() private msg!: string

  mounted() {
    game = new Game(this.$refs.canvas);
    
    (<any>this.$refs.canvas).addEventListener("mouseenter", this.mouseenter);

    //threejs发过来的消息
    GameEvent.ins.on(GameEvent.SELECT_ITEM, (e:any) => {this.changeSelectItem(e)});
    GameEvent.ins.on(GameEvent.SELECT_LIGHT, (e:any) => {this.changeSelectLight(e)});

    GameEvent.ins.on(GameEvent.ITEM_INFO, (e:any) => {this.changeItemInfo(e)});

    
    
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

    //Paramview组件发过来的消息
    GameEvent.ins.on(GameEvent.CHANGE_ITEM_PARAM, (e:any) => {this.changeItemParam(e)});

    this.initStats();

  }

  initStats(){
    var stats = Stats();
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

    if(list[0] == "geometry"){
      let param:any = Object.assign(this.$store.state.curParam, {});
      param[list[1]] = Number(value);
      game.changeGeometryParam(param);
      // this.$store.commit("changeCurParams", param);
    }
    else if(list[0] == "position" || list[0] == "rotation" || list[0] == "scale"){
      let transform:any = Object.assign(this.$store.state.curTransform, {});
			transform[list[0]][list[1]] = Number(value);
      game.changeItemTransform(transform);
      // this.$store.commit("changeCurTransform", transform);
    }
    else if(list[0] == "material"){
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
    else if(list[0] == "light"){
      game.changeLightParam(list[1], value);
    }
    else if(list[0] == "fog"){
      let fog = Object.assign(this.$store.state.fog, {});
      fog[list[1]] = value;
      this.$store.commit("changeFog", fog);
      game.changeFog(fog);
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
    this.$store.commit("changeItemInfo", e.detail);
  }

  changeCurTransform(e:CustomEvent):void{
    this.$store.commit("changeCurTransform", e.detail);
  }

  handleFile(e:any):void{
    console.log(e);
    var reader = new FileReader();
      reader.readAsArrayBuffer(e.target.files[0]);
      reader.onload = (r) => {
          console.info(reader.result);
          var rs = new DataView(reader.result as ArrayBuffer);
          console.log(rs);
          game.loadObject(rs.buffer);
          // reader.readAsText(new Blob( [rs] ), 'utf-8');
          // reader.onload = function(){
          //     console.info(reader.result);
          // }
          // this.download(new Blob( [rs], { type: 'text/plain' } ), filename);
      }
  }

  handleLoad():void{
    // let data:any = null;
    // game.loadObject(data);
    (this.$refs.file as any).click();
  }

  handleCustomGeometry():void{
    this.$store.commit("changeCustomGeometryVisible", true);
  }

  handleSave():void{
    game.exportObject();
  }

  handleTest():void{
    game.loadTest();
  }

  addCustomGeometry(e:CustomEvent):void{
    game.addCustomGeometry(e.detail);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
