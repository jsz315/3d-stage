<template>
    <div class="home">
        <Stage />
        <LeftSide />
        <RightSide />
        <TextureView />
        <CustomGeometry />
        <MenuView />
        <RemoteView />
        <FileView />
        <GltfConfig />
        <Loading :progress="progress" v-if="false" />
    </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Stage from "@/components/Stage/index.vue";
import LeftSide from "@/components/LeftSide/index.vue";
import RightSide from "@/components/RightSide/index.vue";
import TextureView from "@/components/TextureView/index.vue";
import CustomGeometry from "@/components/CustomGeometry/index.vue";
import MenuView from "@/components/MenuView/index.vue";
import RemoteView from "@/components/RemoteView/index.vue";
import FileView from "@/components/FileView/index.vue";
import Loading from "@/components/Loading/index.vue";
import GltfConfig from "@/components/GltfConfig/index.vue";
// import EventCenter from "@/core/EventCenter";
import GameEvent from "@/core/event/index";

export default {
    data() {
        return {
            progress: 30
        };
    },
    components: {
        Stage,
        LeftSide,
        RightSide,
        TextureView,
        CustomGeometry,
        MenuView,
        RemoteView,
        Loading,
        FileView,
        GltfConfig
    },
    mounted() {
        GameEvent.ins.on(GameEvent.LOADING, e => {
            this.progress = e.detail;
        });
    }
};
</script>
