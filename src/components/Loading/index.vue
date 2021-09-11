<template>
    <div
        :style="{
            width: size,
            height: size,
        }"
        class="progress-container"
    >
        <svg class="svg" :viewBox="`0 0 ${svgWidth} ${svgWidth}`">
            <circle :cx="radius + lineWidth / 2" :cy="radius + lineWidth / 2" :r="radius" stroke="#bcbcbc" :stroke-width="lineWidth" fill="none" />
            <!-- <path :d="backPath" fill="none" :stroke-width="lineWidth" stroke="#bcbcbc"></path> -->
            <path
                class="path"
                :d="path"
                fill="none"
                :stroke-width="lineWidth"
                stroke-linecap="butt"
                :style="{
                    //'stroke-dasharray': dashArray,
                }"
                :stroke="stroke"
            ></path>
        </svg>
        <div class="inner-content">
            <slot>
                {{ progressText }}
            </slot>
        </div>
    </div>
</template>

<script>
// import { mapMutations, mapState } from "vuex";
// import { H5Listener } from "../../game/comm/H5Listener";
const LINE_WIDTH = 8;
const SVG_WIDTH = 100;
export default {
    props: {
        progress: {
            type: Number,
            default: 50,
        },
        size: {
            type: String,
            default: "100px",
        },
        stroke: {
            type: String,
            default: "#d5d5d6",
        },
    },
    data() {
        return {
            active: null,
            NUM: "",
            result: [],
            x: 0,
            y: 0,
        };
    },
    computed: {
        lineWidth() {
            return LINE_WIDTH;
        },
        svgWidth() {
            return SVG_WIDTH;
        },
        radius() {
            return (this.svgWidth - this.lineWidth) / 2;
        },
        fixedProgress() {
            return Math.max(Math.min(100, this.progress), 0);
        },
        progressText() {
            return this.fixedProgress + "%";
        },
        deg() {
            return (2 * Math.PI * (this.fixedProgress - 0.1)) / 100;
        },
        backPath() {
            let sx = this.svgWidth / 2,
                sy = this.lineWidth / 2;
            let dx = this.svgWidth - this.lineWidth / 2,
                dy = this.svgWidth / 2;
            let r = this.radius;
            return `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${dx} ${dy} A ${r} ${r} 0 1 1 ${sx} ${sy}`;
        },
        path() {
            let r = this.radius;
            let sx = this.svgWidth / 2,
                sy = this.lineWidth / 2;
            let dx = this.svgWidth / 2 + Math.sin(this.deg) * r;
            let dy = this.svgWidth / 2 - Math.cos(this.deg) * r;
            let arc = this.fixedProgress > 50 ? 1 : 0;
            return `M ${sx} ${sy} A ${r} ${r} 0 ${arc} 1 ${dx} ${dy}`;
        },
        dashArray() {
            let ratio = this.fixedProgress / 100;
            let c = Math.PI * 2 * this.radius;
            return `${((c * ratio) / this.svgWidth) * 100}, ${((c * (1 - ratio)) / this.svgWidth) * 100}`;
        },
    },
};
</script>

<style lang="less" scoped>
@import url("./index");
</style>
