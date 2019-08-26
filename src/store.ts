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
    texureViewType: null,
    materialType: null,
    chooseImage: null,
    curDragType: null
  },
  mutations: {
    changeDrag(state, item){
      state.dragItem = item;
    },
    changeCurParams(state, curParam){
      state.curParam = curParam;
    },
    changeCurTransform(state, curTransform){
      state.curTransform = curTransform;
    },
    changeCurMaterial(state, curMaterial){
      state.curMaterial = curMaterial;
    },
    changeDrawer(state, drawer){
      state.drawer = drawer;
    },
    changeTexureViewVisible(state, texureViewVisible){
      state.texureViewVisible = texureViewVisible;
    },
    changeChooseImage(state, chooseImage){
      state.chooseImage = chooseImage;
    },
    changeTexureViewType(state, texureViewType){
      state.texureViewType = texureViewType;
    },
    changeMaterialType(state, materialType){
      state.materialType = materialType;
    },
    changeCurDragType(state, curDragType){
      state.curDragType = curDragType;
    }
  },
  actions: {

  }
});
