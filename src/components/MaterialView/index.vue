<template>
  <div class="material-view">

      <el-dropdown trigger="click" @command="handleChoose">
        <span class="el-dropdown-link">
          <span class="mat-btn">当前材质：{{materialType}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in list" :key="item.name" :command="index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="edit" v-for="(item, index) in material" :key="index">
        <ParamView :label="index" :value="item" :pname="'material.' + index" />
      </div>

  </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import ParamView from "@/components/ParamView/index.vue";
import config from "@/core/config/material"
import ParamTooler from "@/core/tool/ParamTooler"

export default {
  data() {
    return {
      cur: "",
      list: []
    };
  },
  props: ["materialType", "material"],
  components: {
    ParamView
  },
  computed: {
    // materialType(){
    //   return this.$store.state.materialType;
    // },
    // material() {
    //   return this.$store.state.curMaterial;
    // }
  },

  mounted() {
    this.list = config;
    // this.$axios.get("asset/material.json").then(res => {
    //   this.list = res.data;
    //   this.cur = this.list[0].name;
    // });
  },

  methods: {
    handleChoose(n) {
      // this.$store.commit("changeCurMaterial", this.list[n].param);
      if(this.$store.state.materialType != this.list[n].name){
        GameEvent.ins.send(GameEvent.CHANGE_MATERIAL, this.list[n].name);
      }
    },
    handleChange(pname, n){
      // console.log(pname, n);
      // debugger
      // let list = pname.split(".");
      // let material = Object.assign(this.material, {});
      // ParamTooler.setObjectValue(material, pname, n);
      // this.$store.commit("changeCurMaterial", material);
      // GameEvent.ins.send(GameEvent.CHANGE_MATERIAL, {name: pname, value: n});
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>