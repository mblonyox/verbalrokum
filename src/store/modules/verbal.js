import firebase from 'firebase';
import { firebaseAction } from 'vuexfire';
import router from '../../router';

const state = {
  verbals: [],
  bagian: [],
  pegawai: [],
  tujuan: [],
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
  saveNewVerbal({ commit, rootState }, newVerbal) {
    const verbalRef = firebase.database().ref('/verbals');
    const agendaRef = firebase.database().ref('/agenda');
    const currentYear = (new Date()).getFullYear();
    commit('addQueue');
    verbalRef.push(newVerbal)
      .then((newRef) => {
        agendaRef.child(currentYear).transaction((ag) => {
          const agenda = ag || { lastVal: 0 };
          agenda.lastVal += 1;
          agenda[agenda.lastVal] = newRef.key;
          return agenda;
        })
        .then((result) => {
          newRef.child('log').push({ text: 'Verbal direkam.', time: Date.now(), user: rootState.auth.user.uid });
          if (result.committed) newRef.child('nomorAgenda').set(`${result.snapshot.child('lastVal').val()}/SJ.3/${currentYear}`);
          newRef.child('status').set({ text: 'Direkam', color: 'teal' });
          commit('removeQueue');
          router.push('/verbal/all');
        });
      });
  },
  updateVerbalStatus({ commit, rootState }, newStatus) {
    commit('addQueue');
    const verbalRef = firebase.database().ref('/verbals').child(newStatus.uid);
    const statusPromise = verbalRef.child('status').set({ text: newStatus.text, color: newStatus.color });
    const logPromise = verbalRef.child('log').push({ text: newStatus.logText, note: newStatus.note, time: Date.now(), user: rootState.auth.user.uid });
    const naskahPromise = verbalRef.child('naskah').set(newStatus.naskah);
    Promise.all([statusPromise, logPromise, naskahPromise]).then(() => {
      commit('removeQueue');
    });
  },
  setVerbalRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('verbals', ref, {
      readyCallback: () => { commit('removeQueue'); },
    });
  }),
  initVerbalRef({ commit, dispatch }) {
    const verbalRef = firebase.database().ref('/verbals').orderByKey();
    commit('addQueue');
    dispatch('setVerbalRef', verbalRef);
  },
  setTujuanRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('tujuan', ref, {
      readyCallback: () => { commit('removeQueue'); },
    });
  }),
  initTujuanRef({ commit, dispatch }) {
    const tujuanRef = firebase.database().ref('/tujuan');
    commit('addQueue');
    dispatch('setTujuanRef', tujuanRef);
  },
  addTujuan({ commit }, tujuan) {
    firebase.database().ref('/tujuan').push(tujuan);
  },
  initBagianPegawai({ state, commit }) {
    if (state.pegawai.length && state.bagian.length) return;
    commit('addQueue');
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
      commit('removeQueue');
    });
  },
};

export default {
  state,
  mutations,
  actions,
};
