<template>
    <PopView :visible="visible.file" title="模型" :close="onHide" width="80%">
        <div class="box">
            <div class="tip">拖动文件到框内</div>
            <input class="file" type="file" @change="onChange" />
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
            list: []
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
            this.changeVisible({ key: "file", value: false });
        },
        path(url) {
            return url.replace(
                "./obj",
                "https://jsz315.gitee.io/three-web-app/obj"
            );
        },
        onChange(e) {
            var files = e.target.files;
            if (files && files[0]) {
                GameEvent.ins.send(GameEvent.IMPORT_FILE, files[0]);
            }
            e.target.value = "";
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
