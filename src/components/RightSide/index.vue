<template>
    <div class="right-side" :class="{ hide }">
        <!-- <component :is="aim"/> -->
        <div class="toggle" @click="onToggle">
            <i
                :class="!hide ? 'el-icon-caret-right' : 'el-icon-caret-left'"
            ></i>
        </div>
        <div class="mesh-info">
            <div class="title">
                <div class="name">属性</div>
                <!-- <div class="close" @click="handleClose">
					<i class="el-icon-close"></i>
				</div> -->
            </div>

            <div class="cur-name">
                <input
                    type="text"
                    class="name"
                    v-bind:value="curItemName"
                    ref="name"
                />
                <el-button size="mini" @click="handleChangeName"
                    >修改</el-button
                >
            </div>

            <el-collapse
                v-model="activeNames"
                @change="handleCollapse"
                accordion
            >
                <el-collapse-item title="材质" name="0" v-if="showMaterial">
                    <MaterialView />
                </el-collapse-item>

                <el-collapse-item title="状态参数" name="1">
                    <ProtoView
                        :label="paramType"
                        :parameters="parameters"
                    ></ProtoView>
                </el-collapse-item>

                <el-collapse-item title="位置" name="2" v-if="transform">
                    <ProtoView
                        label="position"
                        :parameters="transform.position"
                    ></ProtoView>
                </el-collapse-item>

                <el-collapse-item title="旋转" name="3" v-if="transform">
                    <RotateView
                        label="rotation"
                        :parameters="transform.rotation"
                    ></RotateView>
                </el-collapse-item>

                <el-collapse-item title="缩放" name="4" v-if="transform">
                    <ProtoJoinView
                        label="scale"
                        :parameters="transform.scale"
                    ></ProtoJoinView>
                </el-collapse-item>

                <el-collapse-item title="数据" name="5" v-if="showGeometryView">
                    <GeometryView />
                </el-collapse-item>

                <el-collapse-item title="物体" name="6">
                    <Object3dView />
                </el-collapse-item>
            </el-collapse>

            <div class="btns" v-if="showBtns">
                <el-button-group>
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleMakeGroup"
                        >成组</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleSplitGroup"
                        >解组</el-button
                    >
                </el-button-group>

                <el-button-group class="right-btns">
                    <el-button type="primary" size="small" @click="handleCopy"
                        >复制</el-button
                    >
                    <el-button type="danger" size="small" @click="handleDelete"
                        >删除</el-button
                    >
                </el-button-group>
            </div>

            <!-- <SwitchView
                label="显示"
                :value="visible"
                pname=""
                @change="visibleChange"
            ></SwitchView>
            <el-button
                class="del-btn"
                type="danger"
                size="small"
                @click="handleDelete"
                >删除选中物体</el-button
            > -->
        </div>
    </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import MaterialView from "@/components/MaterialView/index.vue";
import ProtoView from "@/components/ProtoView/index.vue";
import ProtoJoinView from "@/components/ProtoJoinView/index.vue";
import RotateView from "@/components/RotateView/index.vue";
import GeometryView from "@/components/GeometryView/index.vue";
import ComputeView from "@/components/ComputeView/index.vue";
import Object3dView from "@/components/Object3dView/index.vue";
import SwitchView from "@/components/ParamView/SwitchView/index.vue";

export default {
    data() {
        return {
            value: 0,
            direction: "rtl",
            activeNames: ["0"],
            hide: false,
            visible: true
        };
    },
    components: {
        MaterialView,
        ProtoView,
        ProtoJoinView,
        GeometryView,
        ComputeView,
        RotateView,
        SwitchView,
        Object3dView
    },
    computed: {
        paramType() {
            let type = this.$store.state.type;
            type = type || "";
            if (type == "Mesh") {
                return "geometry";
            } else if (type.substr(-5) == "Light") {
                return "light";
            } else if (type == "Scene") {
                return "scene";
            }
            return "";
        },
        curItemName() {
            return this.$store.state.name;
        },
        childName() {
            return this.$store.state.childName;
        },
        showMaterial() {
            let extra = this.$store.state.extra;
            return extra && extra.material;
        },
        showBtns() {
            if (this.$store.state.type == "Scene") {
                return false;
            }
            return true;
        },
        showGeometryView() {
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
        materialType() {
            return this.$store.state.extra.materialType;
        },
        material() {
            return this.$store.state.extra.material;
        },
        drawer() {
            return this.$store.state.drawer;
        },
        curDragType() {
            return this.$store.state.curDragType;
        }
    },

    methods: {
        visibleChange(a, v) {
            this.visible = v;
            console.log("---", a, v);
            GameEvent.ins.send(GameEvent.TOGGLE_VISIBLE, this.visible);
        },
        handleChangeName(e) {
            console.log(this.curItemName, this.$refs.name.value);
            GameEvent.ins.send(
                GameEvent.CHANGE_ITEM_NAME,
                this.$refs.name.value
            );
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        },
        handleClose() {
            // this.$store.commit("changeDrawer", false);
        },
        handleCopy() {
            GameEvent.ins.send(GameEvent.COPY_ITEM);
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        },
        handleDelete() {
            this.$store.commit("changeDrawer", false);
            GameEvent.ins.send(GameEvent.DELETE_ITEM);
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        },
        handleMakeGroup() {
            GameEvent.ins.send(GameEvent.MAKE_GROUP);
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        },
        handleSplitGroup() {
            GameEvent.ins.send(GameEvent.SPLIT_GROUP);
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        },
        handleCollapse(e) {
            console.log(e);
        },
        handleChange(e) {},
        onToggle() {
            this.hide = !this.hide;
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
