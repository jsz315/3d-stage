<template>
  <div class="home">
    <Stage />
    <LeftSide />
    <RightSide />
    <TextureView />
    <CustomGeometry />
    <MenuView />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Stage from "@/components/Stage/index.vue";
import LeftSide from "@/components/LeftSide/index.vue";
import RightSide from "@/components/RightSide/index.vue";
import TextureView from "@/components/TextureView/index.vue";
import CustomGeometry from "@/components/CustomGeometry/index.vue";
import MenuView from "@/components/MenuView/index.vue";

@Component({
  components: {
    Stage,
    LeftSide,
    RightSide,
    TextureView,
    CustomGeometry,
    MenuView
  }
})
export default class Home extends Vue {}
</script>
