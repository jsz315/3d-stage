<template>
    <div class="color-view">
        <div class="param">
            <div class="state">
                <div class="label">{{ label }}:</div>
                <input type="color" class="value" v-bind:value="color" v-on:input="handleChange" :data-pname="pname" />
            </div>
        </div>
    </div>
</template>

<script>
import GameEvent from "@/core/event/index";
import ColorTooler from "@/core/tool/ColorTooler";

export default {
    data() {
        return {
            configVisible: false,
            min: 0,
            max: 10,
            step: 1,
        };
    },
    props: ["label", "value", "pname"],
    computed: {
        color() {
            console.log("color ==== " + typeof this.value);
            if (!this.value) {
                return "#ffffff";
            }
            let data;
            if (typeof this.value == "string") {
                data = this.value.replace("0x", "#");
            } else {
                let r = this.value.r * 255;
                let g = this.value.g * 255;
                let b = this.value.b * 255;
                data = "#" + ColorTooler.RGBtoHex(r, g, b);
            }
            // let data = "#" + this.value.toString(16);
            console.log(this.value, data);
            return data;
        },
    },

    mounted() {},

    methods: {
        handleChange(e) {
            // console.log(e.target.value);
            // let key = e.target.dataset.pname;
            // console.log(key);
            // console.log(e.target.dataset);
            let data = e.target.value;
            this.$emit("change", this.pname, data);
        },
        handleSetting(e) {
            let key = e.target.dataset.pname;
            this[key] = e.target.value;
        },
    },
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
