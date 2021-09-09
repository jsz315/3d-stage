<template>
  <div class="remote-view" v-show="visible.remote">
    <div class="content">
      <div class="title">模型<i class="el-icon-close" @click="onHide"></i></div>
      <div class="list">
        <div class="item" @click="onLoad(item.url)" v-for="(item, index) in list" :key="index">
          <div class="img-box">
            <img :src="path(item.img)"/>
          </div>
          <div class="tip">{{item.title}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import ProtoView from "@/components/ProtoView/index.vue";
import { mapState, mapMutations } from 'vuex';
import axios from 'axios';
export default {
		data() {
			return {
        list: []
			};
		},
		components: {
		  
    },
    computed: {
      ...mapState(["visible"]),
    },
    mounted() {
      axios.get("/obj/model.json").then(res=>{
        console.log(typeof res.data);
        console.log(res);
        var str = res.data.replace(/\r\n/g, "");
        // console.log(str)
        // this.list = JSON.parse(str);
        var fun = new Function("return " + str);
        var list = fun();
        this.list = list.filter((v, i)=>{
          return v.img.indexOf("/thing/") != -1
        })
      });
    },
    methods: {
      ...mapMutations(["changeVisible"]),
      onHide(){
        this.changeVisible({key: "remote", value: false})
      },
      path(url){
        return url.replace("./obj", "https://jsz315.gitee.io/three-web-app/obj")
      },
      onLoad(url){
        url = url.substr(1);
        // game.loadServeModel(url);
        GameEvent.ins.send(GameEvent.IMPORT_SCENE, url); 
        this.onHide();
      },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index.less";
</style>
