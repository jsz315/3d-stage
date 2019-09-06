<template>
    <div class="menu-view">

        <input ref="file" class="file" type="file" @change="handleSelectFile"/>

        <el-dropdown class="item-nav" @command="handleFile">
            <span class="el-dropdown-link">
                <i class="el-icon-s-promotion"></i>文件
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">导入文件</el-dropdown-item>
                <el-dropdown-item command="1">标准导出(Base64)</el-dropdown-item>
                <el-dropdown-item command="2">标准导出(Blob)</el-dropdown-item>
                <el-dropdown-item command="3">自定义导出(Base64)</el-dropdown-item>
                <el-dropdown-item command="4">自定义导出(Blob)</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="item-nav" @command="handleTest">
            <span class="el-dropdown-link">
                <i class="el-icon-s-opportunity"></i>测试
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">加载文件</el-dropdown-item>
                <el-dropdown-item command="1">运行状态</el-dropdown-item>
                <el-dropdown-item command="2">添加自定义模型</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="item-nav" @command="handleCompute">
            <span class="el-dropdown-link">
                <i class="el-icon-edit-outline"></i>运算
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">相减(Subtract)</el-dropdown-item>
                <el-dropdown-item command="1">相交(Intersect)</el-dropdown-item>
                <el-dropdown-item command="2">相加(Union)</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
    
</template>

<script>
import GameEvent from "@/core/event/index";
import ParamTooler from "@/core/tool/ParamTooler";

export default {
    data() {
        return {
            position: "",
            normal: "",
            uv: "",
            index: "",
            activeIndex: '1',
            activeIndex2: '1'
        };
    },
    components: {},
    computed: {
        visible() {
            return this.$store.state.customGeometryVisible;
        }
    },
    mounted() {},

    methods: {
        handleSure() {
            if (this.position && this.normal && this.uv && this.index) {
                this.$store.commit("changeCustomGeometryVisible", false);
                GameEvent.ins.send(GameEvent.CUSTOM_GEOMETRY, {
                    position: this.position,
                    normal: this.normal,
                    uv: this.uv,
                    index: this.index
                });
            } else {
                this.$message("请输入正确数据");
            }
        },
        handleClose() {
            this.$store.commit("changeCustomGeometryVisible", false);
        },
        handleSelectFile(e) {
            let f = e.target.files[0];
            if(f){
                GameEvent.ins.send(GameEvent.IMPORT_SCENE, f);
            }
        },
        handleFile(e){
            console.log(e);
            if(e == 0){
                this.$refs.file.click();
            }
            else if(e == 1){
                GameEvent.ins.send(GameEvent.EXPORT_SCENE, 1);
            }
            else if(e == 2){
                GameEvent.ins.send(GameEvent.EXPORT_SCENE, 2);
            }
            else if(e == 3){
                GameEvent.ins.send(GameEvent.EXPORT_SCENE, 3);
            }
            else if(e == 4){
                GameEvent.ins.send(GameEvent.EXPORT_SCENE, 4);
            }
        },
        handleTest(e){
            console.log(e);
            if(e == 0){
                GameEvent.ins.send(GameEvent.LOAD_SCENE, null);
            }
            else if(e == 1){
                GameEvent.ins.send(GameEvent.TOGGLE_STATS, null);
            }
            else if(e == 2){
                this.$store.commit("changeCustomGeometryVisible", true);
            }
        },
        handleCompute(e){
            console.log(e);
            if(e == 0){
                GameEvent.ins.send(GameEvent.BSP_SUBTRACT, null);
            }
            else if(e == 1){
                GameEvent.ins.send(GameEvent.BSP_INTERSECT, null);
            }
            else if(e == 2){
                GameEvent.ins.send(GameEvent.BSP_UNION, null);
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>