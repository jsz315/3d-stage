<template>
  <div class="stage">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/core/Game"; // @ is an alias to /src

let game:Game;

@Component
export default class Stage extends Vue {
  @Prop() private msg!: string;

  mounted() {
    game = new Game(this.$refs.canvas);
    (<any>this.$refs.canvas).addEventListener("mouseenter", this.mouseenter);
  }

  mouseenter(e:MouseEvent):void{
    if(this.$store.state.dragItem){
      console.log("mouseenter");
      game.addObject(this.$store.state.dragItem.name);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.stage {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
