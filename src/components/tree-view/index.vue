<template>
    <div class="tree-view">
        <div class="box" v-for="item in list" :key="item.uuid">
            <div
                class="item"
                :style="{ paddingLeft: level * 10 + 4 + 'px' }"
                :class="{ selected: item.uuid == uuid }"
                @mousedown="onMouseDown(item, $event)"
                @mouseup="onMouseup(item)"
            >
                <i
                    class="icon"
                    :class="icon(item)"
                    v-if="hasChildren(item)"
                ></i>
                <span class="name">{{ item.name }}</span>
            </div>

            <div
                class="item drag"
                :style="{
                    paddingLeft: level * 10 + 4 + 'px',
                    transform: `translateY(${y}px)`
                }"
                :class="{ selected: item.uuid == uuid }"
                v-if="item.uuid == uuid && draging"
            >
                <i
                    class="icon"
                    :class="icon(item)"
                    v-if="hasChildren(item)"
                ></i>
                <span class="name">{{ item.name }}</span>
            </div>

            <tree-view
                class="children"
                :uuid="uuid"
                :level="level + 1"
                :nodeClick="nodeClick"
                :class="{ hide: item.hide }"
                :dragFun="dragFun"
                v-if="hasChildren(item)"
                :list="item.children"
            ></tree-view>
        </div>
    </div>
</template>

<!-- <template id="tree-template">
    <h4>{{tip}}</h4>
</template> -->

<script>
import { H5EventDispatcher } from "jsz-event";

let fromItem = null;
let toItem = null;

export default {
    name: "TreeView",
    props: {
        list: {
            type: Array,
            default: []
        },
        level: {
            type: Number,
            default: 0
        },
        nodeClick: {
            type: Function
        },
        dragFun: {
            type: Function
        },
        uuid: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            draging: false,
            y: 0
        };
    },
    // components: {Tree},
    computed: {},
    created() {},
    mounted() {},
    methods: {
        onClick(item) {
            console.log("click tree", item);
            // this.$emit("toggle", item);
            this.nodeClick && this.nodeClick(item);
        },
        hasChildren(item) {
            return item.children && item.children.length;
        },
        onMouseDown(item, e) {
            // e.preventDefault();
            this.nodeClick && this.nodeClick(item);

            fromItem = item;

            this.draging = true;

            console.log("e", e);
            var x = e.clientX;
            var y = e.clientY;
            this.y = 0;
            var onMouseMove = H5EventDispatcher.createDomListenter(
                window,
                "mousemove",
                e => {
                    var ox = e.clientX - x;
                    var oy = e.clientY - y;

                    this.y += oy;

                    x = e.clientX;
                    y = e.clientY;
                }
            );

            var onMouseUp = H5EventDispatcher.createDomListenter(
                window,
                "mouseup",
                e => {
                    onMouseUp();
                    onMouseMove();
                    this.draging = false;
                    this.dragFun && this.dragFun(fromItem, toItem);
                }
            );
        },
        icon(item) {
            return item.hide ? "el-icon-folder" : "el-icon-folder-opened";
        },
        onMouseup(item) {
            toItem = item;
            // console.log("onMouseup", item);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
