<template>
    <div class="object3d-view">
        <div class="comm">
            <div class="label">x轴对齐</div>
            <div class="info">
                <el-button size="mini" type="primary" @click="align(1, 'x')"
                    >1</el-button
                >
                <el-button size="mini" type="primary" @click="align(0, 'x')"
                    >0</el-button
                >
                <el-button size="mini" type="primary" @click="align(-1, 'x')"
                    >-1</el-button
                >
            </div>
        </div>

        <div class="comm">
            <div class="label">y轴对齐</div>
            <div class="info">
                <el-button size="mini" type="primary" @click="align(1, 'y')"
                    >1</el-button
                >
                <el-button size="mini" type="primary" @click="align(0, 'y')"
                    >0</el-button
                >
                <el-button size="mini" type="primary" @click="align(-1, 'y')"
                    >-1</el-button
                >
            </div>
        </div>

        <div class="comm">
            <div class="label">z轴对齐</div>
            <div class="info">
                <el-button size="mini" type="primary" @click="align(1, 'z')"
                    >1</el-button
                >
                <el-button size="mini" type="primary" @click="align(0, 'z')"
                    >0</el-button
                >
                <el-button size="mini" type="primary" @click="align(-1, 'z')"
                    >-1</el-button
                >
            </div>
        </div>

        <div class="comm">
            <div class="label">旋转</div>
            <div class="info">
                <el-button size="mini" type="primary" @click="rotate('x')"
                    >x</el-button
                >
                <el-button size="mini" type="primary" @click="rotate('y')"
                    >y</el-button
                >
                <el-button size="mini" type="primary" @click="rotate('z')"
                    >z</el-button
                >
            </div>
        </div>

        <NumberView
            label="缩放"
            :value="scale"
            pname=""
            @change="scaleChange"
        ></NumberView>

        <SwitchView
            label="显示"
            :value="visible"
            pname=""
            @change="visibleChange"
        ></SwitchView>
        <div class="btns">
            <el-button size="small" type="danger" @click="handleDelete"
                >删除</el-button
            >
            <el-button size="small" type="primary" @click="handleCopy"
                >复制</el-button
            >
            <el-button size="small" type="primary" @click="handlePaste"
                >粘贴</el-button
            >
        </div>
    </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import NumberView from "@/components/ParamView/NumberView/index.vue";
import SwitchView from "@/components/ParamView/SwitchView/index.vue";

export default {
    data() {
        return {
            scale: 1,
            visible: true
        };
    },
    components: {
        NumberView,
        SwitchView
    },
    computed: {
        info() {
            return this.$store.state.extra.geometry;
        }
    },
    methods: {
        visibleChange(a, v) {
            this.visible = v;
            console.log("---", a, v);
            GameEvent.ins.send(GameEvent.TOGGLE_VISIBLE, this.visible);
        },
        align(type, axis) {
            GameEvent.ins.send(GameEvent.MESH_ALIGN, { type, axis });
        },
        rotate(n) {
            GameEvent.ins.send(GameEvent.OBJ_ROTATE, n);
        },
        scaleChange(pname, n) {
            this.scale = n;
            GameEvent.ins.send(GameEvent.MESH_SCALE, n);
        },
        handleDelete() {
            this.$store.commit("changeDrawer", false);
            GameEvent.ins.send(GameEvent.DELETE_ITEM);
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE);
        },
        handleCopy() {
            GameEvent.ins.send(GameEvent.COPY_ITEM);
        },
        handlePaste() {
            GameEvent.ins.send(GameEvent.PASTE_ITEM);
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
