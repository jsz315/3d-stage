<template>
  <div class="left-side">
    <div class="type" v-for="(item, idx) in list" :key="item.name">
      <img class="img" draggable="false" :src="item.img" :data-idx="idx" />
      <div class="tip">{{item.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";

@Component
export default class LeftSide extends Vue {
	@Prop() private msg!: string;
	
	@Provide() tip:string = "ok";

  @Provide() list: Array<Object> = [];

  mounted() {
    (<any>this).$axios.get('asset/data.json').then((res: any) => {
      this.list = res.data;
    })
    this.$el.addEventListener("mousedown", e => {
			console.log("mousedown");
			let obj:any = e.target;
			if(obj.className == "img"){
				let item = this.list[obj.dataset.idx];
				this.$store.commit("changeDrag", item);
				window.addEventListener("mousemove", this.mouseMove);
				window.addEventListener("mouseup", this.mouseUp);
			}
    });

  }

  mouseMove(e: MouseEvent) {
		// console.log("mouseMove " + this.tip);
	}

  mouseUp(e: MouseEvent) {
    console.log("mouseUp");
    window.removeEventListener("mousemove", this.mouseMove);
		window.removeEventListener("mouseup", this.mouseUp);
		this.$store.commit("changeDrag", null);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
