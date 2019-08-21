<template>
  <div class="stage">
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
    GameEvent.ins.on(GameEvent.SELECT_ITEM, (e:any) => {this.info(e)});
  }

  mouseenter(e:MouseEvent):void{
    if(this.$store.state.dragItem){
      console.log("mouseenter");
      game.addObject(this.$store.state.dragItem.name, e);
    }
  }

  info(e:CustomEvent):void{
    console.log(e);
    this.$store.commit("changeCurParams", e.detail.parameters);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
