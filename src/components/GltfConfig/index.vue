<template>
    <PopView
        :visible="visible.gltf"
        title="导出模型"
        :close="onHide"
        width="50%"
    >
        <div class="box">
            <div class="tip">导出模型配置：</div>
            <div class="checks">
                <el-checkbox-group v-model="checkList">
                    <el-checkbox
                        v-for="item in list"
                        :key="item"
                        :label="item"
                    ></el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="btns">
                <el-button size="mini" @click="onHide">取消</el-button>
                <el-button size="mini" type="primary" @click="onSure"
                    >确定</el-button
                >
            </div>
        </div>
    </PopView>
</template>

<script>
import GameEvent from "@/core/event/index";
import PopView from "@/components/PopView/index.vue";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
    data() {
        return {
            list: ["binary", "onlyVisible", "embedImages"],
            checkList: []
        };
    },
    components: { PopView },
    computed: {
        ...mapState(["visible"])
    },
    mounted() {},
    methods: {
        ...mapMutations(["changeVisible"]),
        onHide() {
            this.changeVisible({ key: "gltf", value: false });
        },
        onSure() {
            var param = {};
            this.list.forEach(item => {
                param[item] = this.checkList.includes(item);
            });
            console.log("---1", param);
            GameEvent.ins.send(GameEvent.MODEL_EXPORT, {
                type: "2",
                param: param
            });
            this.onHide();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
