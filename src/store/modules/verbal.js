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
  setData(state, { target, value }) {
    state[target] = value;
  },
  addLabel(state, label) {
    state.labels.push(label);
  },
  addTujuan(state, tujuan) {
    state.tujuan.push(tujuan);
  },
};

const getters = {
  filteredVerbals(state) {
    return state.verbals.filter(v => state.filters.status.includes(v.status ? v.status.text : ''));
  },
};

const actions = {
  saveNewVerbal({ commit, dispatch, rootState }, newVerbal) {
    const verbalRef = firebase.database().ref('/verbals');
    const agendaRef = firebase.database().ref('/agenda');
    const currentYear = (new Date()).getFullYear();
    commit('setPending', true);
    dispatch('showSnackbar', {
      show: true,
      message: 'Menyimpan verbal baru.',
      color: 'info',
      timeout: 0,
    });
    verbalRef.push(newVerbal)
      .then((newRef) => {
        agendaRef.child(currentYear).transaction((ag) => {
          const agenda = ag || { lastVal: 0 };
          agenda.lastVal += 1;
          agenda[agenda.lastVal] = newRef.key;
          return agenda;
        })
        .then((result) => {
          const nomorAgenda = result.committed ? `Verb-${result.snapshot.child('lastVal').val()}/SJ.3/${currentYear}` : undefined;
          const agendaPromise = newRef.child('nomorAgenda').set(nomorAgenda);
          const logPromise = newRef.child('log').push({ text: 'Verbal direkam.', time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
          const updatePromise = newRef.update({
            status: { text: 'Direkam', color: 'teal' },
            updatedAt: firebase.database.ServerValue.TIMESTAMP,
          });
          Promise.all([agendaPromise, logPromise, updatePromise]).then(() => {
            commit('setPending', false);
            dispatch('showSnackbar', {
              show: true,
              message: `Verbal berhasil disimpan. Nomor Agenda: ${nomorAgenda}`,
              color: 'success',
              timeout: 3000,
            });
            router.push('/verbal');
          });
        });
      });
  },
  updateVerbalStatus({ commit, dispatch, rootState }, newStatus) {
    commit('setPending', true);
    dispatch('showSnackbar', {
      show: true,
      message: 'Memperbarui status verbal.',
      color: 'info',
      timeout: 0,
    });
    const verbalRef = firebase.database().ref('/verbals').child(newStatus.uid);
    const statusPromise = verbalRef.update({
      status: { text: newStatus.text, color: newStatus.color },
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
      naskah: newStatus.naskah,
    });
    const logPromise = verbalRef.child('log').push({ text: newStatus.logText, note: newStatus.note, time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
    Promise.all([statusPromise, logPromise]).then(() => {
      commit('setPending', false);
      dispatch('showSnackbar', {
        show: true,
        message: 'Status verbal telah disimpan.',
        color: 'success',
        timeout: 3000,
      });
    });
  },
  editVerbal({ commit, dispatch, rootState }, data) {
    commit('setPending', true);
    dispatch('showSnackbar', {
      show: true,
      message: 'Menyimpan verbal.',
      color: 'info',
      timeout: 0,
    });
    const { id, form } = data;
    const verbalRef = firebase.database().ref('/verbals').child(id);
    verbalRef.update(form)
      .then(() => {
        verbalRef.child('log').push({ text: 'Verbal diubah.', time: firebase.database.ServerValue.TIMESTAMP, user: rootState.auth.user.displayName });
        commit('setPending', false);
        dispatch('showSnackbar', {
          show: true,
          message: 'Verbal berhasil disimpan.',
          color: 'success',
          timeout: 3000,
        });
        router.push('/verbal');
      });
  },
  /* eslint arrow-body-style: ["off", "always"] */
  getDataOnce({ commit }, { ref, target }) {
    return ref.once('value')
      .then((snapshot) => {
        const value = Object.values(snapshot.val());
        commit('setData', { target, value });
      });
  },
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
    dispatch('showSnackbar', {
      show: true,
      message: 'Memuat data verbal',
      color: 'info',
      timeout: 0,
    });
    const db = firebase.database();
    const refs = [
      { target: 'tujuan', ref: db.ref('/tujuan') },
      { target: 'labels', ref: db.ref('/labels') },
      { target: 'pegawai', ref: db.ref('/pegawai') },
      { target: 'bagian', ref: db.ref('/bagians') },
    ];
    const promises = refs.map(ref => dispatch('getDataOnce', ref));
    promises.push(dispatch('setFirebaseRef', { target: 'verbals', ref: db.ref('/verbals').orderByKey() }));
    Promise.all(promises)
      .then(() => {
        commit('setPending', false);
        dispatch('showSnackbar', {
          show: true,
          message: 'Data verbal telah siap.',
          color: 'success',
          timeout: 3000,
        });
      });
  },
  addTujuan({ commit }, tujuan) {
    firebase.database()
      .ref('/tujuan')
      .push(tujuan)
      .then(() => { commit('addTujuan', tujuan); });
  },
  addLabel({ commit }, label) {
    firebase.database()
      .ref('/labels')
      .push(label)
      .then(() => { commit('addLabel', label); });
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
