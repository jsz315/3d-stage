<template>
  <div class="transform-view">
    <div class="edit" v-for="(item, index) in list" :key="index">
      <ParamView :label="index" :value="item" :pname="label + '.' + index" />
    </div>
  </div>
</template>

<script>
  import GameEvent from "@/event/index";
  import ParamView from "@/components/ParamView/index.vue";
  import config from "@/core/material"
  import ParamTooler from "@/core/ParamTooler"

  export default {
    data() {
      return {
        
      };
    },
    props: ["list", "label"],
    components: {
      ParamView
    },
    computed: {
      
    },

    mounted() {
      
    },

    methods: {
      handleChange(pname, n) {
        let key = e.target.dataset.name;
        console.log(key);

        let temp = key.split(".");
        if (temp.length == 1) {
          let obj = {};
          obj[key] = Number(e.target.value);
          let param = Object.assign(this.$store.state.curParam, obj);
          this.$store.commit("changeCurParams", param);
          console.log("changeCurParams");
          GameEvent.ins.send(GameEvent.CHANGE_PARAM, param);
        }
        else {
          let transform = Object.assign(this.$store.state.curTransform, {});
          transform[temp[0]][temp[1]] = Number(e.target.value);
          this.$store.commit("changeCurTransform", transform);
          console.log("changeCurTransform");
          GameEvent.ins.send(GameEvent.CHANGE_TRANSFORM, transform);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  @import "./index.less";
</style>