import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dragItem: Object,
    curParam: Object,
    curTransform: {},
    isDrag: false,
    drawer: false,
  },
  mutations: {
    changeDrag(state, item){
      state.dragItem = item;
    },
    changeCurParams(state, param){
      state.curParam = param;
      state.drawer = true;
    },
    changeCurTransform(state, transform){
      state.curTransform = transform;
    },
    changeDrawer(state, drawer){
      state.drawer = drawer;
    },
  },
  actions: {

  }
});
