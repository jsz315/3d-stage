<template>
    <div class="custom-geometry">
        <el-dialog title="自定义物体" :visible="visible" @close="handleClose">
            <div class="label">position: 例如:[1,2,3]</div>
            <textarea class="txt" v-model="position" rows="4"></textarea>
            <div class="label">normal: 例如:[1,2,3]</div>
            <textarea class="txt" v-model="normal" rows="4"></textarea>
            <div class="label">uv: 例如:[1,2,3]</div>
            <textarea class="txt" v-model="uv" rows="4"></textarea>
            <div class="label">index: 例如:[1,2,3]</div>
            <textarea class="txt" v-model="index" rows="4"></textarea>
            <el-button class="btn" type="primary" icon="el-icon-position" @click="handleSure">确定</el-button>
        </el-dialog>
    </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import ParamTooler from "@/core/tool/ParamTooler";

export default {
    data() {
        return {
            position: "",
            normal: "",
            uv: "",
            index: "",
        };
    },
    components: {},
    computed: {
        visible() {
            return this.$store.state.customGeometryVisible;
        },
    },
    mounted() {},

    methods: {
        handleSure() {
            if (this.position && this.normal && this.uv && this.index) {
                this.$store.commit("changeCustomGeometryVisible", false);
                GameEvent.ins.send(GameEvent.CUSTOM_GEOMETRY, {
                    position: this.position,
                    normal: this.normal,
                    uv: this.uv,
                    index: this.index,
                });
            } else {
                this.$message("请输入正确数据");
            }
        },
        handleClose() {
            this.$store.commit("changeCustomGeometryVisible", false);
        },
    },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
