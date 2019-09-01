<template>
	<div class="right-side" :class="{open: drawer}">
		<!-- <component :is="aim"/> -->

		<div class="mesh-info">
			<div class="title">
				<div class="name">属性</div>
				<div class="close" @click="handleClose">
					<i class="el-icon-close"></i>
				</div>
			</div>

			<div class="cur-name">
                <span @click="handleChangeRoot(true)">{{curItemName}}</span>
                <template v-if="childName">
                    | <span @click="handleChangeRoot(false)">{{childName}}</span>
                </template>
            </div>

			<el-collapse v-model="activeNames" @change="handleCollapse" accordion>
				<el-collapse-item title="材质" name="0" v-if="showMaterial">
					<MaterialView />
				</el-collapse-item>

				<el-collapse-item title="状态参数" name="1">
					<ProtoView :label="paramType" :parameters="parameters"></ProtoView>
				</el-collapse-item>

				<el-collapse-item title="位置" name="2" v-if="transform">
					<ProtoView label="position" :parameters="transform.position"></ProtoView>
				</el-collapse-item>

				<el-collapse-item title="旋转" name="3" v-if="transform">
					<ProtoView label="rotation" :parameters="transform.rotation"></ProtoView>
				</el-collapse-item>

				<el-collapse-item title="缩放" name="4" v-if="transform">
					<ProtoView label="scale" :parameters="transform.scale"></ProtoView>
				</el-collapse-item>

				<el-collapse-item title="数据" name="5" v-if="showGeometryView">
					<GeometryView />
				</el-collapse-item>

			</el-collapse>

			<div class="btns" v-if="showBtns">

				<el-button-group>
					<el-button type="primary" size="small" @click="handleMakeGroup">成组</el-button>
					<el-button type="primary" size="small" @click="handleSplitGroup">解组</el-button>
				</el-button-group>

				<el-button-group class="right-btns">
					<el-button type="primary" size="small" @click="handleCopy">复制</el-button>
					<el-button type="danger" size="small" @click="handleDelete">删除</el-button>
				</el-button-group>

			</div>
		</div>
		

	</div>
</template>

<script>
	import GameEvent from "@/core/event/index";
	import MaterialView from "@/components/MaterialView/index.vue";
	import ProtoView from "@/components/ProtoView/index.vue";
	import GeometryView from "@/components/GeometryView/index.vue";

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
			ProtoView,
			GeometryView
		},
		computed: {
			paramType(){
				let type = this.$store.state.type;
				type = type || "";
				if(type == "Mesh"){
					return "geometry";
				}
				else if(type.substr(-5) == "Light"){
					return "light";
				}
				else if(type == "Scene"){
					return "scene";
				}
				return "";
			},
			curItemName(){
				return this.$store.state.name;
            },
            childName(){
                return this.$store.state.childName;
            },
			showMaterial(){
				let extra = this.$store.state.extra;
				return extra && extra.material;
			},
			showBtns(){
				if(this.$store.state.type == "Scene"){
					return false;
				}
				return true;
			},
			showGeometryView(){
				let extra = this.$store.state.extra;
				return extra && extra.geometry;
			},
			parameters() {
				var obj = {};
				var curParam = this.$store.state.parameters;
				for (let i in curParam) {
					obj[i] = curParam[i] || 0;
				}
				return obj;
			},
			transform() {
				return this.$store.state.transform;
			},
			materialType(){
				return this.$store.state.extra.materialType;
			},
			material() {
				return this.$store.state.extra.material;
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
			handleMakeGroup(){
				GameEvent.ins.send(GameEvent.MAKE_GROUP);
			},
			handleSplitGroup(){
				GameEvent.ins.send(GameEvent.SPLIT_GROUP);
			},
			handleCollapse(e) {
				console.log(e);
			},
			handleChange(e) {
            },
            handleChangeRoot(n){
                GameEvent.ins.send(GameEvent.CHANGE_IS_ROOT, n);
            }
		}
	};
</script>

<style lang="less" scoped>
	@import "./index.less";
</style>