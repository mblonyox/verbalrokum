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
    const agendaRef = firebase.database().ref('/agenda');
    const currentYear = (new Date()).getFullYear();
    commit('setLoading', true);
    verbalRef.push(newVerbal)
      .then((newRef) => {
        agendaRef.child(currentYear).transaction((ag) => {
          const agenda = ag || { lastVal: 0 };
          agenda.lastVal += 1;
          agenda[agenda.lastVal] = newRef.key;
          return agenda;
        })
        .then((result) => {
          if (result.committed) newRef.child('nomorAgenda').set(`${result.snapshot.child('lastVal').val()}/SJ.3/${currentYear}`);
          commit('setLoading', false);
          router.push('/verbal/all');
        });
      });
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
