<template>
  <div class="left-side">

    <el-collapse v-model="activeNames" @change="handleCollapse">

			<el-collapse-item title="几何物体" name="0">
        <div class="geometry" v-for="(item, idx) in geometryList" :key="item.name">
          <img class="img" draggable="false" :src="item.img" :data-idx="idx" />
          <div class="tip">{{item.name}}</div>
        </div>
			</el-collapse-item>

      <el-collapse-item title="灯光" name="1">
        <div class="light" v-for="(item, idx) in lightList" :key="item.name">
          <el-button :data-idx="idx" @click="addLight">{{item.name}}</el-button>
          <!-- <div class="tip" :data-idx="idx" @click="addLight">{{item.name}}</div> -->
        </div>
			</el-collapse-item>

    </el-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import GameEvent from "@/event/index";

@Component
export default class LeftSide extends Vue {
	@Prop() private msg!: string;
	
  @Provide() tip:string = "ok";
  
  @Provide() activeNames: Array<Object> = ['0'];

  @Provide() geometryList: Array<Object> = [];
  @Provide() lightList: Array<Object> = [];

  mounted() {
    (<any>this).$axios.get('asset/data.json').then((res: any) => {
      this.geometryList = res.data.geometry;
      this.lightList = res.data.light;
    })
    this.$el.addEventListener("mousedown", e => {
			let obj:any = e.target;
			if(obj.className == "img"){
				let item = this.geometryList[obj.dataset.idx];
				this.$store.commit("changeDrag", item);
				window.addEventListener("mousemove", this.mouseMove);
				window.addEventListener("mouseup", this.mouseUp);
			}
    });

  }

  handleCollapse(e: any){
    console.log(e);
  }

  mouseMove(e: MouseEvent) {
		// console.log("mouseMove " + this.tip);
	}

  mouseUp(e: MouseEvent) {
    window.removeEventListener("mousemove", this.mouseMove);
		window.removeEventListener("mouseup", this.mouseUp);
		this.$store.commit("changeDrag", null);
  }

  addLight(e:MouseEvent){
    let obj:any = e.currentTarget;
    let item:any = this.lightList[obj.dataset.idx];
    // this.$store.commit("changeDrag", item);
    GameEvent.ins.send(GameEvent.ADD_LIGHT, item.name);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
