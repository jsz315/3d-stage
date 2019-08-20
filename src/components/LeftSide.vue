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

  @Provide() list: Array<Object> = [
    {
      name: "BoxBufferGeometry",
      img: "/asset/img/s1.jpg"
    },
    {
      name: "SphereBufferGeometry",
      img: "/asset/img/s2.jpg"
    },
    {
      name: "DodecahedronBufferGeometry",
      img: "/asset/img/s3.jpg"
    },
    {
      name: "CylinderBufferGeometry",
      img: "/asset/img/s4.jpg"
    }
  ];

  mounted() {
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
.left-side {
  position: fixed;
  width: 200px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  left: 0;
  top: 0;
  z-index: 3;
  background: #ffffff;
  box-shadow: 1px 2px 4px 0px rgba(0, 0, 0, 0.25);
}
.type {
  padding: 10px;
  width: 180px;
  margin: auto;
}
.img {
  width: 100%;
  margin-bottom: 10px;
}
.tip {
  font-size: 12px;
  text-align: center;
  margin-bottom: 40px;
  color: #999999;
}
</style>
