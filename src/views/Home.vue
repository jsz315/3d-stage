<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <Stage />
    <LeftSide />
    <RightSide/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Stage from "@/components/Stage/index.vue";
import LeftSide from "@/components/LeftSide/index.vue";
import RightSide from "@/components/RightSide/index.vue";

@Component({
  components: {
    HelloWorld,
    Stage,
    LeftSide,
    RightSide
  }
})
export default class Home extends Vue {}
</script>
