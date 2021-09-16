<template>
    <div class="pop-view" v-show="visible">
        <div class="pannel" :style="{ width }">
            <div class="title">
                {{ title }}<i class="el-icon-close" @click="close"></i>
            </div>
            <div class="content" :style="{ height }">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import ProtoView from "@/components/ProtoView/index.vue";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
    data() {
        return {
            list: []
        };
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ""
        },
        width: {
            type: String,
            default: "50%"
        },
        height: {
            type: String,
            default: "auto"
        },
        close: {
            type: Function
        }
    },
    components: {},
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
