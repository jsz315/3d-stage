<template>
  <div class="image-view">
    <div class="param">

      <div class="state">
        <div class="label">{{label}}:</div>
        <div class="img" v-if="value && value.image" @click="handleEdit" :style="{'background-image': 'url(' + value.image + ')'}"></div>
        <div class="choose" @click="handleEdit"><i class="el-icon-picture-outline"></i> 修改</div>
        <div class="delete" @click="handleDelete"><i class="el-icon-delete"></i> 删除</div>
      </div>

      <NumberView v-if="value && value.repeatX" :label="'repeatX'" :value="value.repeatX" :pname="'material.' + label + '.repeatX'" @change="handleChange"/>
      <NumberView v-if="value && value.repeatY" :label="'repeatY'" :value="value.repeatY" :pname="'material.' + label + '.repeatY'" @change="handleChange"/>
      
    </div>
  </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import NumberView from "../NumberView/index.vue";

export default {
  data() {
    return {
    };
  },
  props: ["label", "value", "pname"],
  components: {
    NumberView
  },
  computed: {
    editing(){
      return this.$store.state.changeTexureViewVisible;
    }
  },

  watch: {
    
  },

  mounted() {

  },

  methods: {
    handleChange(name, data) {
      this.$emit("change", name, data);
    },
    handleEdit(e){
      this.$store.commit("changeTexureViewVisible", true);
      this.$store.commit("changeTexureViewType", this.pname + ".image");
    },
    handleDelete(e){
      GameEvent.ins.send(GameEvent.DELETE_TEXTURE, this.label);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>