import firebase from 'firebase';
import { firebaseAction } from 'vuexfire';
import router from '../../router';

const state = {
  verbals: [],
};

const mutations = {
};

const actions = {
  saveNewVerbal({ commit }, newVerbal) {
    const verbalRef = firebase.database().ref('/verbals');
    commit('setLoading', true);
    verbalRef.push(newVerbal, (err) => { commit('setLoading', false); if (!err) router.push('/verbal'); });
  },
  setVerbalRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('verbals', ref, {
      readyCallback: () => { commit('setLoading', false); },
    });
  }),
  initVerbalRef({ commit, dispatch }) {
    const verbalRef = firebase.database().ref('/verbals');
    commit('setLoading', true);
    dispatch('setVerbalRef', verbalRef);
  },
};

export default {
  state,
  mutations,
  actions,
};
