<template>
    <div class="info-view">
        <template v-if="info">
            <div class="comm" v-if="info.position">
                <div class="label" @click="log(info.position)">position</div>
                <div class="info" @click="log(info.position, true)">
                    <div class="tip">length: {{info.position.count * info.position.itemSize}}</div>
                    <div class="tip">count: {{info.position.count}}</div>
                    <div class="tip">itemSize: {{info.position.itemSize}}</div>
                </div>
            </div>

            <div class="comm" v-if="info.normal">
                <div class="label" @click="log(info.normal)">normal</div>
                <div class="info" @click="log(info.normal, true)">
                    <div class="tip">length: {{info.normal.count * info.normal.itemSize}}</div>
                    <div class="tip">count: {{info.normal.count}}</div>
                    <div class="tip">itemSize: {{info.normal.itemSize}}</div>
                </div>
            </div>

            <div class="comm" v-if="info.uv">
                <div class="label" @click="log(info.uv)">uv</div>
                <div class="info" @click="log(info.uv, true)">
                    <div class="tip">length: {{info.uv.count * info.uv.itemSize}}</div>
                    <div class="tip">count: {{info.uv.count}}</div>
                    <div class="tip">itemSize: {{info.uv.itemSize}}</div>
                </div>
            </div>

            <div class="comm" v-if="info.index">
                <div class="label" @click="log(info.index)">index</div>
                <div class="info" @click="log(info.index, true)">
                    <div class="tip">length: {{info.index.count}}</div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="none">无数据</div>
        </template>
    </div>
</template>

<script>
import GameEvent from "@/core/event/index";

export default {
    data() {
        return {};
    },
    components: {},
    computed: {
        info() {
            return this.$store.state.extra.geometry;
        }
    },
    methods: {
        log(n, join) {
            if (join) {
                console.log("[" + n.array.join(",") + "]");
            } else {
                console.log(n.array);
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>