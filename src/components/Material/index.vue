<template>
  <div class="material">

      <el-dropdown trigger="click" @command="handleChoose">
        <span class="el-dropdown-link">
          <span class="mat-btn">当前材质：{{cur}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in list" :key="item.name" :command="index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="edit" v-for="(item, index) in material" :key="index">
        <ParamView :label="index" :value="item" :pname="index" @change="handleChange" />
      </div>

  </div>
</template>

<script>
import GameEvent from "@/event/index";
import ParamView from "@/components/ParamView/index.vue";

export default {
  data() {
    return {
      cur: "",
      list: []
    };
  },
  components: {
    ParamView
  },
  computed: {
    material() {
      let cur = this.$store.state.curMaterial;
      this.cur = cur.type;
      let aim = this.list.find(item => {
        return item.type == cur.type;
      })
      if(!aim){
        return {};
      }
      let obj = {};
      for(let i in aim.param){
        obj[i] = cur[i];
      }
      console.log("修改后");
      console.log(obj);
      return obj;
    }
  },

  mounted() {
    this.$axios.get("asset/material.json").then(res => {
      this.list = res.data;
      this.cur = this.list[0].name;
    });
  },

  methods: {
    handleChoose(n) {
      this.$store.commit("changeCurMaterial", this.list[n].param);
    },
    handleChange(pname, n){
      console.log("changeCurMaterial " + pname, n);
      let material = Object.assign(this.$store.state.curMaterial, {});
      material[pname] = Number(n);
      this.$store.commit("changeCurMaterial", material);
      GameEvent.ins.send(GameEvent.CHANGE_MATERIAL, {name: pname, value: n});
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>