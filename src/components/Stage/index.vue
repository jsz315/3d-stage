<template>
    <div class="stage">
        <div class="info">
            <div class="tip">Q-坐标系 | W-移动 | E-旋转 | R-缩放</div>
            <div class="btns">
                <i class="btn el-icon-refresh-left" @click="undo">撤销</i>
                <i class="btn el-icon-refresh-right" @click="redo">重做</i>
            </div>
        </div>
        <canvas ref="canvas" class="canvas"></canvas>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Game from "@/core/Game"; // @ is an alias to /src
import GameEvent from "@/core/event/index";
import ParamTooler from "@/core/tool/ParamTooler";
import { Stats } from "@/core/tool/Stats";
import { Presenter } from "@/core/history/Presenter";
import { mapState, mapMutations } from "vuex";

let game: Game;
let dataList: any;
let stats: any;

@Component
export default class Stage extends Vue {
    mounted() {
        game = new Game(this.$refs.canvas);

        // (<any>this.$refs.canvas).addEventListener(
        //     "mouseenter",
        //     this.mouseenter
        // );

        //threejs发过来的消息
        // GameEvent.ins.on(GameEvent.SELECT_ITEM, (e:any) => {this.changeSelectItem(e)});
        // GameEvent.ins.on(GameEvent.SELECT_LIGHT, (e:any) => {this.changeSelectLight(e)});

        GameEvent.ins.on(GameEvent.ITEM_INFO, (e: CustomEvent) => {
            this.changeItemInfo(e);
        });
        GameEvent.ins.on(GameEvent.FAIL_COMPUTE, (e: CustomEvent) => {
            // this.$message(e.detail);
        });

        GameEvent.ins.on(GameEvent.CHANGE_MATERIAL, (e: CustomEvent) => {
            game.toggerMaterial(e.detail);
        });

        GameEvent.ins.on(GameEvent.DELETE_TEXTURE, (e: CustomEvent) => {
            game.deleteTexture(e.detail);
        });
        GameEvent.ins.on(GameEvent.DELETE_ITEM, (e: CustomEvent) => {
            game.deleteItem();
        });
        GameEvent.ins.on(GameEvent.COPY_ITEM, (e: CustomEvent) => {
            game.copyItem();
        });

        GameEvent.ins.on(GameEvent.ADD_LIGHT, (e: CustomEvent) => {
            game.addLight(e.detail);
        });

        GameEvent.ins.on(GameEvent.CUSTOM_GEOMETRY, (e: CustomEvent) => {
            game.addCustomGeometry(e.detail);
        });
        GameEvent.ins.on(GameEvent.MAKE_GROUP, (e: CustomEvent) => {
            game.makeGroup();
        });
        GameEvent.ins.on(GameEvent.SPLIT_GROUP, (e: CustomEvent) => {
            game.splitGroup();
        });
        // GameEvent.ins.on(GameEvent.CHANGE_IS_ROOT, (e:any) => {this.changeIsRoot(e)});

        GameEvent.ins.on(GameEvent.GET_SCENE_TREE, (e: CustomEvent) => {
            this.getSceneTree(e);
        });
        GameEvent.ins.on(GameEvent.SELECT_TREE_ITEM, (e: CustomEvent) => {
            game.selectedItemByUUID(e.detail);
        });

        GameEvent.ins.on(GameEvent.CHANGE_ITEM_NAME, (e: CustomEvent) => {
            game.changeItemName(e.detail);
        });

        GameEvent.ins.on(GameEvent.BSP_SUBTRACT, (e: CustomEvent) => {
            game.bspSubtract();
        });
        GameEvent.ins.on(GameEvent.BSP_INTERSECT, (e: CustomEvent) => {
            game.bspIntersect();
        });
        GameEvent.ins.on(GameEvent.BSP_UNION, (e: CustomEvent) => {
            game.bspUnion();
        });

        GameEvent.ins.on(GameEvent.EXPORT_SCENE, (e: CustomEvent) => {
            this.handleExport(e);
        });

        GameEvent.ins.on(GameEvent.TOGGLE_STATS, (e: CustomEvent) => {
            this.handleStats(e);
        });
        GameEvent.ins.on(GameEvent.IMPORT_SCENE, (e: CustomEvent) => {
            this.handleFile(e);
        });

        //Paramview组件发过来的消息
        GameEvent.ins.on(GameEvent.CHANGE_ITEM_PARAM, (e: CustomEvent) => {
            this.changeItemParam(e);
        });

        GameEvent.ins.on(GameEvent.PASTE_ITEM, (e: CustomEvent) => {
            game.pasteItem();
        });

        GameEvent.ins.on(GameEvent.MESH_ALIGN, (e: CustomEvent) => {
            var { type, axis } = e.detail;
            game.changeMeshAlign(type, axis);
        });
        GameEvent.ins.on(GameEvent.MODEL_EXPORT, (e: CustomEvent) => {
            game.changeMeshExport(e.detail);
        });

        GameEvent.ins.on(GameEvent.OBJ_ROTATE, (e: CustomEvent) => {
            game.objRotate(e.detail);
        });

        GameEvent.ins.on(GameEvent.CHANGE_LEVEL, (e: CustomEvent) => {
            var { fromItem, toItem } = e.detail;
            game.changeLevel(fromItem, toItem);
        });

        GameEvent.ins.on(GameEvent.IMPORT_FILE, (e: CustomEvent) => {
            game.importFile(e.detail);
        });

        GameEvent.ins.on(GameEvent.LOAD_ZIP, (e: CustomEvent) => {
            game.loadServeZip(e.detail);
        });

        GameEvent.ins.on(GameEvent.TOGGLE_VISIBLE, (e: CustomEvent) => {
            console.log(e.detail, "visible");
            game.toggleVisible(e.detail);
        });

        GameEvent.ins.on(GameEvent.MESH_SCALE, (e: CustomEvent) => {
            game.meshScale(e.detail);
        });

        GameEvent.ins.on(GameEvent.DRAG_ITEM, (e: CustomEvent) => {
            if (this.$store.state.dragItem) {
                game.addObject(this.$store.state.dragItem.name, this.$store.state.dragPosition);
            }
        });

        this.initStats();
    }

    undo() {
        Presenter.instance.undo();
    }

    redo() {
        Presenter.instance.redo();
    }

    initStats() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "204px";
        stats.domElement.style.top = "90px";
        stats.domElement.style.zIndex = 1;
        document.body.appendChild(stats.domElement);

        game.setStats(stats);
    }
    changeMaterial(e: CustomEvent) {
        game.toggerMaterial(e.detail);
    }

    changeItemParam(e: CustomEvent) {
        console.log("Paramview组件发过来的消息");
        console.log(e.detail);
        let value = e.detail.value;
        let list = e.detail.name.split(".");
        let type = list[0];

        if (type == "geometry") {
            let param: any = Object.assign(this.$store.state.curParam, {});
            param[list[1]] = Number(value);
            game.changeGeometryParam(param);
            // this.$store.commit("changeCurParams", param);
        } else if (
            type == "position" ||
            type == "rotation" ||
            type == "scale"
        ) {
            let transform: any = Object.assign(this.$store.state.transform, {});
            if (type == "scale" && this.$store.state.lockScale) {
                transform.scale.x = transform.scale.y = transform.scale.z = Number(
                    value
                );
            } else {
                transform[type][list[1]] = Number(value);
            }
            if (type == "rotation") {
                if (this.$store.state.isAngle) {
                    transform[type][list[1]] = (Number(value) * Math.PI) / 180;
                } else {
                    transform[type][list[1]] = Number(value);
                }
            }
            game.changeItemTransform(transform);
        } else if (type == "material") {
            let material = Object.assign(this.$store.state.curMaterial, {});
            if (ParamTooler.checkMap(list[1])) {
                if (list[2] == "image") {
                    game.changeTextureMaterial(list[1], value);
                } else {
                    game.changeRepeatMaterial(list[1], list[2], value);
                }
                if (!material[list[1]]) {
                    material[list[1]] = {};
                }
                material[list[1]][list[2]] = value;
            } else {
                material[list[1]] = value;
                game.changeCommonMaterial(list[1], value);
            }
        } else if (type == "light") {
            game.changeLightParam(list[1], value);
        } else if (type == "scene") {
            let data = Object.assign(this.$store.state, {});
            let parameters = data.parameters;
            parameters[list[1]] = value;
            this.$store.commit("changeItemInfo", [data]);
            game.changeScene(parameters);
        }
    }

    // mouseenter(e: MouseEvent): void {
    //     if (this.$store.state.dragItem) {
    //         game.addObject(this.$store.state.dragItem.name, e);
    //     }
    // }

    changeSelectItem(e: CustomEvent): void {
        this.$store.commit("changeCurItemName", e.detail.name);
        this.$store.commit("changeCurDragType", "mesh");
        this.$store.commit("changeDrawer", true);
        this.$store.commit("changeMaterialType", e.detail.materialType);
        this.$store.commit("changeCurMaterial", e.detail.material);
        this.$store.commit("changeCurParams", e.detail.parameters);
        this.$store.commit("changeCurTransform", e.detail.transform);
    }

    changeSelectLight(e: CustomEvent): void {
        this.$store.commit("changeCurItemName", e.detail.name);
        this.$store.commit("changeCurDragType", "light");
        this.$store.commit("changeDrawer", true);
        this.$store.commit("changeCurParams", e.detail.parameters);
        this.$store.commit("changeCurTransform", e.detail.transform);
    }

    changeItemInfo(e: CustomEvent): void {
        dataList = e.detail;
        this.$store.commit("changeItemInfo", dataList);
        this.$store.commit("changeDrawer", true);
        if (dataList[0] && dataList[0].uuid) {
            GameEvent.ins.send(GameEvent.OPEN_TREE_ITEM, dataList[0].uuid);
        }
    }

    changeCurTransform(e: CustomEvent): void {
        this.$store.commit("changeCurTransform", e.detail);
    }

    handleFile(e: CustomEvent): void {
        console.log(e);
        if (e && e.detail) {
            game.loadServeModel(e.detail);
            return;
        }
        var reader = new FileReader();
        reader.readAsArrayBuffer(e.detail);
        reader.onload = r => {
            console.info(reader.result);
            var rs = new DataView(reader.result as ArrayBuffer);
            console.log(rs);
            game.loadObject(rs.buffer);
        };
    }

    handleStats(e: CustomEvent): void {
        let s = stats.domElement.style;
        console.log(s);
        if (s.display == "none") {
            s.display = "block";
        } else {
            s.display = "none";
        }
    }

    handleExport(e: CustomEvent) {
        let type = e.detail;
        if (type == 1) {
            game.standardExport(true);
        } else if (type == 2) {
            game.standardExport(false);
        } else if (type == 3) {
            game.customExport(true);
        } else if (type == 4) {
            game.customExport(false);
        }
    }

    getSceneTree(e: CustomEvent): void {
        let s = game.getSceneTree();
        console.log("game getSceneTree");
        console.log(s);
        this.$store.commit("changeSceneTree", [s]);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
