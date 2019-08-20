import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dragItem: Object,
    isDrag: false
  },
  mutations: {
    changeDrag(state, item){
      state.dragItem = item; 
    }
  },
  actions: {

  }
});
