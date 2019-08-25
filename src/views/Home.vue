<template>
  <div class="home">
    <Stage />
    <LeftSide />
    <RightSide />
    <TextureView />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Stage from "@/components/Stage/index.vue";
import LeftSide from "@/components/LeftSide/index.vue";
import RightSide from "@/components/RightSide/index.vue";
import TextureView from "@/components/TextureView/index.vue";

@Component({
  components: {
    HelloWorld,
    Stage,
    LeftSide,
    RightSide,
    TextureView
  }
})
export default class Home extends Vue {}
</script>
