<template>
    <div class="left-side" :class="cls">
        <div class="toggle" @click="onToggle">
            <i :class="hide ? 'el-icon-caret-right' : 'el-icon-caret-left'"></i>
        </div>

        <div class="main">
            <el-tabs size="mini" v-model="tabName" type="border-card" @tab-click="handleClick">
                <el-tab-pane size="mini" label="新增" name="first">
                    <el-button size="mini" class="remote" @click="openRemote">远程资源</el-button>
                    <AddView />
                </el-tab-pane>

                <el-tab-pane size="mini" label="层级" name="second">
                    <TreeView />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import GameEvent from "@/core/event/index";
import AddView from "@/components/AddView/index.vue";
import TreeView from "@/components/TreeView/index.vue";
import { mapState, mapMutations } from "vuex";

@Component({
    components: {
        AddView,
        TreeView,
    },
})
export default class LeftSide extends Vue {
    @Provide() tabName: string = "first";
    @Provide() hide: boolean = false;

    mounted() {}

    handleClick(e: any) {
        if (e.index == "1") {
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        }
    }

    openRemote(e: any) {
        this.$store.commit("changeVisible", { key: "remote", value: true });
    }

    onToggle() {
        this.hide = !this.hide;
    }

    get cls() {
        var list = [];
        if (this.tabName == "second") {
            list.push("scene");
        }
        if (this.hide) {
            list.push("hide");
        }
        return list;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
