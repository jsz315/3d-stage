<template>
  <div class="home">
    <Stage />
    <LeftSide />
    <RightSide />
    <TextureView />
    <CustomGeometry />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Stage from "@/components/Stage/index.vue";
import LeftSide from "@/components/LeftSide/index.vue";
import RightSide from "@/components/RightSide/index.vue";
import TextureView from "@/components/TextureView/index.vue";
import CustomGeometry from "@/components/CustomGeometry/index.vue";

@Component({
  components: {
    Stage,
    LeftSide,
    RightSide,
    TextureView,
    CustomGeometry
  }
})
export default class Home extends Vue {}
</script>
