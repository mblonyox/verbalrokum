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
      'Koreksi',
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
    return state.verbals.filter(v => state.filters.status.includes(v.status ? v.status.text : ''));
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
          const agendaPromise = result.committed ? newRef.child('nomorAgenda').set(`Verb-${result.snapshot.child('lastVal').val()}/SJ.3/${currentYear}`) : null;
          const logPromise = newRef.child('log').push({ text: 'Verbal direkam.', time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
          const updatePromise = newRef.update({
            status: { text: 'Direkam', color: 'teal' },
            updatedAt: firebase.database.ServerValue.TIMESTAMP,
          });
          Promise.all([agendaPromise, logPromise, updatePromise]).then(() => {
            commit('removeQueue');
            router.push('/verbal');
          });
        });
      });
  },
  updateVerbalStatus({ commit, rootState }, newStatus) {
    commit('addQueue');
    const verbalRef = firebase.database().ref('/verbals').child(newStatus.uid);
    const statusPromise = verbalRef.update({
      status: { text: newStatus.text, color: newStatus.color },
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
      naskah: newStatus.naskah,
    });
    const logPromise = verbalRef.child('log').push({ text: newStatus.logText, note: newStatus.note, time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
    Promise.all([statusPromise, logPromise]).then(() => {
      commit('removeQueue');
    });
  },
  editVerbal({ commit, state, rootState }, data) {
    commit('addQueue');
    const { id, form } = data;
    const verbalRef = firebase.database().ref('/verbals').child(id);
    verbalRef.update(form)
      .then(() => {
        verbalRef.child('log').push({ text: 'Verbal diubah.', time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
        commit('removeQueue');
        router.push('/verbal');
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
