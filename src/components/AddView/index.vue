<template>
    <el-collapse size="mini" v-model="activeNames" @change="handleCollapse" accordion>
        <el-collapse-item title="geometry" name="0">
            <div class="geometry" v-for="(item, idx) in geometryList" :key="item.name">
                <img class="img" draggable="false" :src="item.img" data-type="geometry" :data-idx="idx" />
                <div class="tip">{{ item.name }}</div>
            </div>
        </el-collapse-item>

        <el-collapse-item title="bufferGeometry" name="1">
            <div class="geometry" v-for="(item, idx) in bufferGeometryList" :key="item.name">
                <img class="img" draggable="false" :src="item.img" data-type="bufferGeometry" :data-idx="idx" />
                <div class="tip">{{ item.name }}</div>
            </div>
        </el-collapse-item>

        <el-collapse-item title="light" name="2">
            <div class="light" v-for="(item, idx) in lightList" :key="item.name">
                <el-button :data-idx="idx" @click="addLight">{{ item.name }}</el-button>
                <!-- <div class="tip" :data-idx="idx" @click="addLight">{{item.name}}</div> -->
            </div>
        </el-collapse-item>
    </el-collapse>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from "vue-property-decorator";
import GameEvent from "@/core/event/index";

@Component({
    components: {},
})
export default class LeftSide extends Vue {
    @Provide() activeNames: string = "0";

    @Provide() geometryList: Array<Object> = [];
    @Provide() bufferGeometryList: Array<Object> = [];
    @Provide() lightList: Array<Object> = [];

    mounted() {
        (<any>this).$axios.get("asset/data.json").then((res: any) => {
            this.geometryList = res.data.geometry;
            this.bufferGeometryList = res.data.bufferGeometry;
            this.lightList = res.data.light;
        });

        this.$el.addEventListener("mousedown", (e) => {
            let obj: any = e.target;
            if (obj.className == "img") {
                let item;
                if (obj.dataset.type == "bufferGeometry") {
                    item = this.bufferGeometryList[obj.dataset.idx];
                } else {
                    item = this.geometryList[obj.dataset.idx];
                }
                this.$store.commit("changeDrag", item);
                window.addEventListener("mousemove", this.mouseMove);
                window.addEventListener("mouseup", this.mouseUp);
            }
        });
    }

    handleCollapse(e: any) {
        console.log(e);
    }

    handleClick(e: any) {
        console.log(e);
        if (e.index == "1") {
            GameEvent.ins.send(GameEvent.GET_SCENE_TREE, null);
        }
    }

    // handleNodeClick(e: any){
    //   console.log(e);
    //   GameEvent.ins.send(GameEvent.SELECT_TREE_ITEM, e.uuid);
    // }

    get sceneTree(): any {
        return this.$store.state.sceneTree;
    }

    mouseMove(e: MouseEvent) {
        // console.log("mouseMove " + this.tip);
    }

    mouseUp(e: MouseEvent) {
        window.removeEventListener("mousemove", this.mouseMove);
        window.removeEventListener("mouseup", this.mouseUp);
        this.$store.commit("changeDrag", null);
    }

    addLight(e: MouseEvent) {
        let obj: any = e.currentTarget;
        let item: any = this.lightList[obj.dataset.idx];
        // this.$store.commit("changeDrag", item);
        GameEvent.ins.send(GameEvent.ADD_LIGHT, item.name);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
