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
    commit('setPending', true);
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
            commit('setPending', false);
            router.push('/verbal');
          });
        });
      });
  },
  updateVerbalStatus({ commit, rootState }, newStatus) {
    commit('setPending', true);
    const verbalRef = firebase.database().ref('/verbals').child(newStatus.uid);
    const statusPromise = verbalRef.update({
      status: { text: newStatus.text, color: newStatus.color },
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
      naskah: newStatus.naskah,
    });
    const logPromise = verbalRef.child('log').push({ text: newStatus.logText, note: newStatus.note, time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
    Promise.all([statusPromise, logPromise]).then(() => {
      commit('setPending', false);
    });
  },
  editVerbal({ commit, state, rootState }, data) {
    commit('setPending', true);
    const { id, form } = data;
    const verbalRef = firebase.database().ref('/verbals').child(id);
    verbalRef.update(form)
      .then(() => {
        verbalRef.child('log').push({ text: 'Verbal diubah.', time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
        commit('setPending', false);
        router.push('/verbal');
      });
  },
  /* eslint arrow-body-style: ["off", "always"] */
  setFirebaseRef: firebaseAction(({ bindFirebaseRef }, { ref, target }) => {
    return new Promise((resolve, reject) => {
      bindFirebaseRef(target, ref, {
        readyCallback: () => { resolve(); },
        errorCallback: () => { reject(new Error('Bind Firebase Ref failed.')); },
      });
    });
  }),
  initFirebaseRef({ commit, dispatch }) {
    commit('setPending', true);
    const db = firebase.database();
    const refs = [
      { target: 'verbals', ref: db.ref('/verbals').orderByKey() },
      { target: 'tujuan', ref: db.ref('/tujuan') },
      { target: 'labels', ref: db.ref('/labels') },
      { target: 'pegawai', ref: db.ref('/pegawai') },
      { target: 'bagian', ref: db.ref('/bagians') },
    ];
    const promises = refs.map(ref => dispatch('setFirebaseRef', ref));
    Promise.all(promises)
      .then(() => { commit('setPending', false); });
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
