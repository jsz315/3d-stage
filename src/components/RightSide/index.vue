<template>
	<div class="right-side" :class="{open: drawer}">
		<component :is="aim"/>
	</div>
</template>

<script>
	import GameEvent from "@/core/event/index";
	import MaterialView from "@/components/MaterialView/index.vue";
	import TransformView from "@/components/TransformView/index.vue";
	import MeshInfo from "@/components/MeshInfo/index.vue";
	import LightInfo from "@/components/LightInfo/index.vue";

	export default {
		data() {
			return {
				value: 0,
				direction: "rtl",
				activeNames: ['0']
			};
		},
		components: {
			MaterialView,
			TransformView,
			MeshInfo,
			LightInfo
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
			curDragType(){
				return this.$store.state.curDragType;
			},
			aim(){
				if(this.$store.state.curDragType == "light"){
					return "LightInfo";
				}
				else{
					return "MeshInfo";
				}
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
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "./index.less";
</style>