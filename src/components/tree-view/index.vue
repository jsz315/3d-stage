<template>
    <div class="tree-view">
        <div v-for="item in list" :key="item.uuid">
            <div class="item" :class="{ selected: item.uuid == uuid }" @click="onClick(item)">
                <i class="icon" :class="icon(item)" v-if="hasChildren(item)"></i>
                <span class="name">{{ item.name }}</span>
            </div>
            <tree-view class="children" :uuid="uuid" :nodeClick="nodeClick" :class="{ hide: item.hide }" v-if="hasChildren(item)" :list="item.children"></tree-view>
        </div>
    </div>
</template>

<!-- <template id="tree-template">
    <h4>{{tip}}</h4>
</template> -->

<script>
export default {
    name: "TreeView",
    props: ["list", "nodeClick", "uuid"],
    data() {
        return {};
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
        icon(item) {
            return item.hide ? "el-icon-folder" : "el-icon-folder-opened";
        },
    },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
