<template>
  <div class="right-side" :class="{open: drawer}">
    <div class="title">
      <div class="name">属性</div>
      <div class="close" @click="handleClose">
        <i class="el-icon-close"></i>
      </div>
    </div>

	<el-collapse v-model="activeNames" @change="handleCollapse">
		<el-collapse-item title="状态参数" name="1">
			<div class="param" v-for="(item, index) in list" :key="index">
			<div class="state">
				<div class="label">{{item.name}}:</div>
				<input
				type="text"
				class="value"
				v-bind:value="item.value"
				v-on:input="handleChange"
				:data-name="item.name"
				/>
			</div>

			<div class="block">
				<!-- <el-slider v-bind:value="item.value" show-input :min="-1" :max="1" :step="0.01" v-on:input.native ="handleChange($event)"></el-slider> -->
				<input
				type="range"
				class="range"
				v-bind:value="item.value"
				v-on:input="handleChange"
				:data-name="item.name"
				/>
			</div>
			</div>
		</el-collapse-item>

		<el-collapse-item title="位置" name="2">
			<div class="param normal" v-for="(item, index) in curTransform.position" :key="'position_' + index">
				<div class="state">
					<div class="label">{{index}}:</div>
					<input
					type="text"
					class="value"
					v-bind:value="item"
					v-on:input="handleChange"
					data-name="position"
					/>
				</div>
			</div>
		</el-collapse-item>

		<el-collapse-item title="旋转" name="3">
			<div class="param normal" v-for="(item, index) in curTransform.rotation" :key="'rotation_' + index">
				<div class="state">
					<div class="label">{{index}}:</div>
					<input
					type="text"
					class="value"
					v-bind:value="item"
					v-on:input="handleChange"
					data-name="rotation"
					/>
				</div>
			</div>
		</el-collapse-item>

		<el-collapse-item title="缩放" name="4">
			<div class="param normal" v-for="(item, index) in curTransform.scale" :key="'scale_' + index">
				<div class="state">
					<div class="label">{{index}}:</div>
					<input
					type="text"
					class="value"
					v-bind:value="item"
					v-on:input="handleChange"
					data-name="scale"
					/>
				</div>
			</div>
		</el-collapse-item>
	</el-collapse>
  </div>
</template>

<script>
import GameEvent from "@/event/index";
// import { Component, Prop, Vue, Provide } from "vue-property-decorator";

// export default class Right extends Vue {
//   value: number = 0;
//   @Provide() direction:string = "rtl";
//   drawer:boolean = true;

//   handleClose(done:Function){
//       console.log(this.drawer);
//       this.drawer = false;
//       done()
//   }
// }

export default {
  data() {
    return {
      value: 0,
	  direction: "rtl",
	  activeNames: ['1']
    };
  },

  computed: {
    list() {
      var list = [];
      var obj = this.$store.state.curParam;
      for (let i in obj) {
        list.push({
          name: i,
          value: obj[i] || 0
        });
      }
      return list;
	},
	curTransform() {
		var obj = this.$store.state.curTransform;
		return obj;
	},
    drawer() {
      return this.$store.state.drawer;
    }
  },

  methods: {
    handleClose() {
      this.$store.commit("changeDrawer", false);
	},
	handleCollapse(e) {
		console.log(e);
	},
    handleChange(e) {
      console.log(e);
	  let key = e.target.dataset.name;
	  console.log(key);

    //   console.log(key + " old = " + e.target.value);
    //   console.log(key + " new = " + this.$store.state.curParam[key]);
    //   let obj = {};
    //   obj[key] = Number(e.target.value);
    //   let param = Object.assign(this.$store.state.curParam, obj);
    //   this.$store.commit("changeCurParams", param);
    //   console.log("changeCurParams");
    //   console.log(param);
    //   GameEvent.ins.send(GameEvent.CHANGE_PARAM, param);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>