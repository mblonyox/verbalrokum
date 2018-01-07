import firebase from 'firebase';
import { firebaseAction } from 'vuexfire';
import router from '../../router';

const state = {
  verbals: [],
  bagian: [],
  pegawai: [],
  tujuan: [],
  labels: [],
  filters: {
    status: [
      'Direkam',
      'Terima',
      'Ajukan',
      'Setuju',
      'Perbaikan',
      'Arsipkan',
    ],
  },
};

const mutations = {
  setFilterStatus(state, statuses) {
    state.filters.status = statuses;
  },
};

const getters = {
  filteredVerbals(state) {
    return state.verbals.filter(v => state.filters.status.includes(v.status.text));
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
          newRef.child('log').push({ text: 'Verbal direkam.', time: Date.now(), user: rootState.auth.user.displayName });
          if (result.committed) newRef.child('nomorAgenda').set(`Verb-${result.snapshot.child('lastVal').val()}/SJ.3/${currentYear}`);
          newRef.child('status').set({ text: 'Direkam', color: 'teal' });
          commit('removeQueue');
          router.push('/verbal');
        });
      });
  },
  updateVerbalStatus({ commit, rootState }, newStatus) {
    commit('addQueue');
    const verbalRef = firebase.database().ref('/verbals').child(newStatus.uid);
    const statusPromise = verbalRef.child('status').set({ text: newStatus.text, color: newStatus.color });
    const logPromise = verbalRef.child('log').push({ text: newStatus.logText, note: newStatus.note, time: Date.now(), user: rootState.auth.user.displayName });
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
  setBagianRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('bagian', ref, {
      readyCallback: () => { commit('removeQueue'); },
    });
  }),
  setPegawaiRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('pegawai', ref, {
      readyCallback: () => { commit('removeQueue'); },
    });
  }),
  setTujuanRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('tujuan', ref, {
      readyCallback: () => { commit('removeQueue'); },
    });
  }),
  setLabelRef: firebaseAction(({ commit, bindFirebaseRef }, ref) => {
    bindFirebaseRef('labels', ref, {
      readyCallback: () => { commit('removeQueue'); },
    });
  }),
  initVerbalRef({ commit, dispatch }) {
    const verbalRef = firebase.database().ref('/verbals').orderByKey();
    commit('addQueue');
    dispatch('setVerbalRef', verbalRef);
  },
  initTujuanRef({ commit, dispatch }) {
    const tujuanRef = firebase.database().ref('/tujuan');
    commit('addQueue');
    dispatch('setTujuanRef', tujuanRef);
  },
  initBagianRef({ commit, dispatch }) {
    const bagianRef = firebase.database().ref('/bagians');
    commit('addQueue');
    dispatch('setBagianRef', bagianRef);
  },
  initPegawaiRef({ commit, dispatch }) {
    const pegawaiRef = firebase.database().ref('/pegawai');
    commit('addQueue');
    dispatch('setPegawaiRef', pegawaiRef);
  },
  initLabelRef({ commit, dispatch }) {
    const labelRef = firebase.database().ref('/labels');
    commit('addQueue');
    dispatch('setLabelRef', labelRef);
  },
  initAllRef({ dispatch }) {
    dispatch('initVerbalRef');
    dispatch('initTujuanRef');
    dispatch('initBagianRef');
    dispatch('initPegawaiRef');
    dispatch('initLabelRef');
  },
  addTujuan({ commit }, tujuan) {
    firebase.database().ref('/tujuan').push(tujuan);
  },
  addLabel({ commit }, label) {
    firebase.database().ref('/labels').push(label);
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
