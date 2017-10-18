import firebase from 'firebase';
import { firebaseAction } from 'vuexfire';
import router from '../../router';

const state = {
  verbals: [],
  bagian: [],
  pegawai: [],
};

const mutations = {
  setBagian(state, bagian) {
    state.bagian = bagian;
  },
  addPegawai(state, pegawai) {
    state.pegawai.push(pegawai);
  },
  clearPegawai(state) {
    state.pegawai = [];
  },
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
  initBagianPegawai({ state, commit }) {
    if (state.pegawai.length && state.bagian.length) return;
    commit('setLoading', true);
    const refBagian = firebase.database().ref('/bagians').once('value').then((snap) => {
      commit('setBagian', snap.val());
    });
    const refPegawai = firebase.database().ref('/pegawai').once('value').then((snap) => {
      commit('clearPegawai');
      snap.forEach((peg) => {
        commit('addPegawai', peg.val());
      });
    });
    Promise.all([refBagian, refPegawai]).then(() => {
      commit('setLoading', false);
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
