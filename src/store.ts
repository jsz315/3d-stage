import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        dragItem: Object,
        curParam: Object,
        curMaterial: Object,
        curTransform: {},
        isDrag: false,
        drawer: false,
        texureViewVisible: false,
        customGeometryVisible: false,
        texureViewType: null,
        materialType: null,
        chooseImage: null,

        //light,mesh,scene,group
        curDragType: null,

        curItemName: null,
        itemInfo: null,

        isRoot: true,
        childName: null,

        type: null,
        name: null,
        parameters: null,
        transform: null,
        extra: null,

        sceneTree: [],
        visible: {
            remote: false,
            file: false
        },
        uuid: "",
        lockScale: true
    },
    mutations: {
        changeLockScale(state, value) {
            state.lockScale = value;
        },
        changeVisible(state, { key, value }) {
            (state.visible as any)[key] = value;
        },
        changeUuid(state, value) {
            state.uuid = value;
        },
        changeItemInfo(state, list) {
            let info = state.isRoot ? list[0] : list[1];
            state.type = info.type;
            state.parameters = info.parameters;
            state.transform = info.transform;
            state.extra = info.extra;

            state.name = list[0].name;
            state.childName = list[1] ? list[1].name : "";
        },

        changeSceneTree(state, sceneTree) {
            state.sceneTree = sceneTree;
        },

        changeDrag(state, item) {
            state.dragItem = item;
        },
        changeCurParams(state, curParam) {
            state.curParam = curParam;
        },
        changeCurTransform(state, curTransform) {
            state.curTransform = curTransform;
        },
        changeCurMaterial(state, curMaterial) {
            state.curMaterial = curMaterial;
        },
        changeDrawer(state, drawer) {
            state.drawer = drawer;
        },
        changeTexureViewVisible(state, texureViewVisible) {
            state.texureViewVisible = texureViewVisible;
        },
        changeChooseImage(state, chooseImage) {
            state.chooseImage = chooseImage;
        },
        changeTexureViewType(state, texureViewType) {
            state.texureViewType = texureViewType;
        },
        changeMaterialType(state, materialType) {
            state.materialType = materialType;
        },
        changeCurDragType(state, curDragType) {
            state.curDragType = curDragType;
        },
        changeCurItemName(state, curItemName) {
            state.curItemName = curItemName;
        },
        changeCustomGeometryVisible(state, customGeometryVisible) {
            state.customGeometryVisible = customGeometryVisible;
        },
        changeIsRoot(state, isRoot) {
            state.isRoot = isRoot;
        },
        changeChildName(state, childName) {
            state.childName = childName;
        }
    },
    actions: {}
});
