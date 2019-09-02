<template>
    <div class="texture-view">
        <el-dialog title="选择贴图" :visible="visible" @close="handleClose" v-dialogDrag>
            <div class="block" v-for="(item, index) in list" :key="index" @click="handleChange(item.url)">
                
                <div class="img" :style="{'background-image': 'url(' + item.url + ')'}"></div>
                <div class="name">{{item.name}}</div>
            
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import GameEvent from "@/core/event/index";
    import ParamTooler from "@/core/tool/ParamTooler";

    export default {
        data() {
            return {
                list: []
            };
        },
        components: {
            
        },
        computed: {
            visible() {
                return this.$store.state.texureViewVisible;
            },
            chooseImage(){
                return this.$store.state.changeChooseImage;
            }
        },
        mounted() {
            this.$axios.get("asset/texture/list.json").then(res => {
                this.list = res.data;
            });
        },

        methods: {
            handleClose(){
                this.$store.commit("changeTexureViewVisible", false);
            },
            handleChoose(n) {
                this.$store.commit("changeCurMaterial", this.list[n].param);
            },
            handleChange(url) {
                let pname = this.$store.state.texureViewType;
                // console.log("changeCurMaterial " + pname, url);

                // let material = Object.assign(this.$store.state.curMaterial, {});
                // ParamTooler.setObjectValue(material, pname, url);
                // if(material[pname]){
                //     material[pname].image = url;
                // }
                // else{
                //     material[pname] = {
                //         image: url,
                //         repeat: {
                //             x: 1,
                //             y: 1
                //         }
                //     }
                // }
                // this.$store.commit("changeCurMaterial", material);
                GameEvent.ins.send(GameEvent.CHANGE_ITEM_PARAM, { name: pname, value: url });
                this.$store.commit("changeTexureViewVisible", false);
            }
        }
    };
</script>

<style lang="less" scoped>
    @import "./index.less";
</style>