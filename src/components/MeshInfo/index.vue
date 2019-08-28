<template>
	<div class="mesh-info">
		<div class="title">
			<div class="name">物体属性</div>
			<div class="close" @click="handleClose">
				<i class="el-icon-close"></i>
			</div>
		</div>

		<div class="cur-name">{{curItemName}}</div>

		<el-collapse v-model="activeNames" @change="handleCollapse" accordion>
			<el-collapse-item title="材质" name="0">
				<MaterialView :material-type="materialType" :material="material" />
			</el-collapse-item>

			<el-collapse-item title="状态参数" name="1">
				<TransformView label="geometry" :list="list"></TransformView>
			</el-collapse-item>

			<el-collapse-item title="位置" name="2">
				<TransformView label="position" :list="curTransform.position"></TransformView>
			</el-collapse-item>

			<el-collapse-item title="旋转" name="3">
				<TransformView label="rotation" :list="curTransform.rotation"></TransformView>
			</el-collapse-item>

			<el-collapse-item title="缩放" name="4">
				<TransformView label="scale" :list="curTransform.scale"></TransformView>
			</el-collapse-item>

			<el-collapse-item title="数据" name="5">
				<InfoView></InfoView>
			</el-collapse-item>

		</el-collapse>
		<div class="btns">
			<el-button type="primary" @click="handleCopy">原地复制</el-button>
			<el-button type="danger" @click="handleDelete">删除物体</el-button>
		</div>
	</div>
</template>

<script>
	import GameEvent from "@/event/index";
	import MaterialView from "@/components/MaterialView/index.vue";
	import TransformView from "@/components/TransformView/index.vue";
	import InfoView from "@/components/InfoView/index.vue";

	export default {
		data() {
			return {
				value: 0,
				direction: "rtl",
				activeNames: '0'
			};
		},
		components: {
			MaterialView,
			TransformView,
			InfoView
		},
		computed: {
			list() {
				var obj = {};
				var curParam = this.$store.state.curParam;
				for (let i in curParam) {
					obj[i] = curParam[i] || 0;
				}
				return obj;
			},
			curTransform() {
				var obj = this.$store.state.curTransform;
				return obj;
			},
			materialType(){
				return this.$store.state.materialType;
			},
			material() {
				return this.$store.state.curMaterial;
			},
			drawer() {
				return this.$store.state.drawer;
			},
			curItemName(){
				return this.$store.state.curItemName;
			}
		},

		methods: {
			handleClose() {
				this.$store.commit("changeDrawer", false);
			},
			handleCopy() {
				GameEvent.ins.send(GameEvent.COPY_ITEM);
			},
			handleDelete() {
				this.$store.commit("changeDrawer", false);
				GameEvent.ins.send(GameEvent.DELETE_ITEM);
			},
			handleCollapse(e) {
				console.log(e);
			},
			handleChange(e) {
				//   console.log(e);
				//   let key = e.target.dataset.name;
				//   console.log(key);

				//   let temp = key.split(".");
				//   if(temp.length == 1){
				// 	let obj = {};
				// 	obj[key] = Number(e.target.value);
				// 	let param = Object.assign(this.$store.state.curParam, obj);
				// 	this.$store.commit("changeCurParams", param);
				// 	console.log("changeCurParams");
				// 	GameEvent.ins.send(GameEvent.CHANGE_PARAM, param);
				//   }
				//   else{
				// 	let transform = Object.assign(this.$store.state.curTransform, {});
				// 	transform[temp[0]][temp[1]] = Number(e.target.value);
				// 	this.$store.commit("changeCurTransform", transform);
				// 	console.log("changeCurTransform");
				// 	GameEvent.ins.send(GameEvent.CHANGE_TRANSFORM, transform);
				//   }
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "./index.less";
</style>