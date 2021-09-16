<template>
    <PopView :visible="visible.file" title="模型" :close="onHide" width="80%">
        <div class="box" :class="{ hited }" ref="box">
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
import { H5EventDispatcher } from "jsz-event";

let dropRemove, dragoverRemove, dragleaveRemove;
export default {
    data() {
        return {
            list: [],
            hited: false
        };
    },
    components: { PopView },
    computed: {
        ...mapState(["visible"])
    },
    mounted() {
        const dragWrapper = this.$refs.box;
        dropRemove = H5EventDispatcher.createDomListenter(
            dragWrapper,
            "drop",
            e => {
                this.hited = false;
                e.preventDefault(); //阻止e的默认行为
                var files = e.dataTransfer.files;
                if (files && files[0]) {
                    GameEvent.ins.send(GameEvent.IMPORT_FILE, files[0]);
                }
                this.onHide();
            }
        );

        dragoverRemove = H5EventDispatcher.createDomListenter(
            dragWrapper,
            "dragover",
            e => {
                e.preventDefault();
                console.log("dragover");
                this.hited = true;
            }
        );

        dragleaveRemove = H5EventDispatcher.createDomListenter(
            dragWrapper,
            "dragleave",
            e => {
                console.log("dragleave");
                this.hited = false;
            }
        );
    },
    beforeDestory() {
        dropRemove && dropRemove();
        dragoverRemove && dragoverRemove();
        dragleaveRemove && dragleaveRemove();
    },
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
            this.onHide();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
