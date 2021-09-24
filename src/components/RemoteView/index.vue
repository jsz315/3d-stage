<template>
    <PopView
        :visible="visible.remote"
        title="模型"
        :close="onHide"
        width="80%"
        height="80vh"
    >
        <div class="list">
            <div
                class="item"
                @click="onLoad(item.url)"
                v-for="(item, index) in list"
                :key="index"
            >
                <div class="img-box">
                    <img :src="path(item.img)" />
                </div>
                <div class="tip">{{ item.title }}</div>
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
            list: []
        };
    },
    components: { PopView },
    computed: {
        ...mapState(["visible"])
    },
    mounted() {
        var url = webHost + "/obj/model.json";
        // if (location.host == "jsz315.gitee.io") {
        //     url = "https://jsz315.gitee.io/three-web-app/obj/model.json";
        // }
        axios.get(url).then(res => {
            console.log(typeof res.data);
            console.log(res);
            if (typeof res.data == "object") {
                this.list = res.data;
                return;
            }
            // var str = res.data.replace(/\r\n/g, "");
            // var fun = new Function("return " + str);
            // var list = fun();
        });
    },
    methods: {
        ...mapMutations(["changeVisible"]),
        onHide() {
            this.changeVisible({ key: "remote", value: false });
        },
        path(url) {
            return url.replace(
                "./obj",
                "https://jsz315.gitee.io/three-web-app/obj"
            );
        },
        onLoad(url) {
            url = url.substr(1);
            // game.loadServeModel(url);
            url = webHost + url;
            console.log(url, "url");
            GameEvent.ins.send(GameEvent.IMPORT_SCENE, url);
            this.onHide();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
