<template>
  <div class="stage">
    <div class="btns">
      <input ref="file" class="file" type="file" @change="handleFile"/>
      <el-button type="primary" icon="el-icon-sold-out" @click="handleLoad">加载模型</el-button>
      <el-button type="primary" icon="el-icon-position" @click="handleSave">导出模型</el-button>
    </div>
    <p class="info">Q-坐标系 | W-移动 | E-旋转 | R-缩放</p>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/core/Game"; // @ is an alias to /src
import GameEvent from '@/event/index'

let game:Game;

@Component
export default class Stage extends Vue {
  @Prop() private msg!: string;

  mounted() {
    game = new Game(this.$refs.canvas);
    
    (<any>this.$refs.canvas).addEventListener("mouseenter", this.mouseenter);
    GameEvent.ins.on(GameEvent.SELECT_ITEM, (e:any) => {this.changeCurParams(e)});
    GameEvent.ins.on(GameEvent.CHANGE_TRANSFORM, (e:any) => {this.changeCurTransform(e)});
  }

  mouseenter(e:MouseEvent):void{
    if(this.$store.state.dragItem){
      console.log("mouseenter");
      game.addObject(this.$store.state.dragItem.name, e);
    }
  }

  changeCurParams(e:CustomEvent):void{
    console.log(e);
    this.$store.commit("changeCurParams", e.detail.parameters);
    this.$store.commit("changeDrawer", true);
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

  handleSave():void{
    game.exportObject();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
