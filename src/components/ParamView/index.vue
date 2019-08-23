<template>
  <div class="param-view">
      <component :is="aim" :label="label" :value="value" :pname="pname" @change="handleChange"></component>
      <!-- <NumberView :label="'高度'" :value="num" :pname="'height'" @change="handleChange"/>
      <ColorView :label="'颜色'" :value="num" :pname="'color'" @change="handleChange"/>
      <SwitchView :label="'显示'" :value="num" :pname="'visible'" @change="handleChange"/>
      <ImageView :label="'贴图'" :value="src" :pname="'color'" @change="handleChange"/> -->
  </div>
</template>

<script>
import GameEvent from "@/event/index";
import ParamTooler from "@/core/ParamTooler";
import NumberView from "./NumberView/index.vue";
import ColorView from "./ColorView/index.vue";
import SwitchView from "./SwitchView/index.vue";
import ImageView from "./ImageView/index.vue";

export default {
  data() {
    return {
      
    };
  },
  props: ["label", "value", "pname"],
  components: {
    NumberView,
    ColorView,
    SwitchView,
    ImageView
  },
  computed: {
    material() {
      return this.$store.state.curMaterial;
    },
    aim(){
        let type = ParamTooler.getType(this.label);
        switch(type){
            case ParamTooler.TYPE_SWITCH:
                return "SwitchView";
            case ParamTooler.TYPE_COLOR:
                return "ColorView";
            case ParamTooler.TYPE_IMAGE:
                return "ImageView";
            default:
                return "NumberView";
        }
    }
  },

  mounted() {
    
  },

  methods: {
    handleChange(pname, n){
    //   console.log(pname, n);
      this.$emit("change", pname, n);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>