<template>
    <img class="img" :src="src" v-if="src" :style="style"/>
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

        };
    },
    components: { PopView },
    computed: {
        ...mapState(["dragItem", "dragPosition", "dragOffset"]),
        src(){
            if(this.dragItem){
                return  this.dragItem.img;
            }
            return "";
        },
        style(){
            return {
                left: this.dragPosition.x - this.dragOffset.x + "px",
                top: this.dragPosition.y - this.dragOffset.y + "px"
            };
        }
    },
    mounted() {

    },
    beforeDestory() {

    },
    methods: {
        ...mapMutations(["changeVisible"]),
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
