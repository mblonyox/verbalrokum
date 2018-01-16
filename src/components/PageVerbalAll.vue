<template>
  <div id="page-verbal">
    <v-layout wrap>
      <v-flex xs12 md2>
        <v-expansion-panel popup v-click-outside="blurFilterCheckbox" class="mb-2">
          <v-expansion-panel-content v-model="filterPanel" >
            <div slot="header">Filter Status</div>
            <v-card>
              <v-card-text>
                <v-checkbox
                  v-model="statusFilterCheckbox"
                  :indeterminate="statusFilterCheckbox === 'indeterminate'"
                  label="Semua"
                  color="black"
                />
                <v-checkbox
                  v-model="filterStatus"
                  label="Direkam"
                  value="Direkam"
                  color="teal"
                  key="cb-Direkam"
                />
                <v-checkbox 
                  v-for="item in status"
                  v-model="filterStatus"
                  :label="item.text"
                  :value="item.text"
                  :color="item.color" 
                  :key="'cb-'+item.text"
                />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-flex xs12 md6 offset-md2>
        <v-text-field
          label="Keyword..."
          v-model="search"
          single-line
        />
      </v-flex>
      <v-flex xs2 offset-xs10 md1 offset-md1>
        <v-btn fab dark class="green" to="/verbal/rekam">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="verbals"
        :pagination.sync="pagination"
        :rows-per-page-items="[25, 50, 100, {text: 'All', value: -1}]"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td><router-link :to="'/verbal/'+props.item['.key']">{{ props.item.nomorAgenda }}</router-link></td>
          <td>{{ new Date(props.item.tanggal).toLocaleDateString('id') }}</td>
          <td>{{ props.item.bagian }}</td>
          <td>{{ idToPegawai(props.item.konseptor).NamaLengkap }}</td>
          <td><span style="white-space: nowrap;">{{ props.item.notaBagian }}</span> <br> <span style="white-space: nowrap;">{{ props.item.verbBagian }}</span> </td>
          <td>{{ props.item.perihal }}</td>
          <td><p class="nowrap">{{ prettyTime(props.item.updatedAt) }}</p></td>
          <td><v-chip :color="props.item.status.color" text-color="white">{{ props.item.status.text }}</v-chip></td>
          <td>
            <v-btn small v-if="props.item.status.text === 'Perbaikan'" @click.stop="printPerbaikan(props.item)">
              <v-icon>print</v-icon>
            </v-btn>
            <v-btn small @click.stop="openDialog(props.item)">Update</v-btn>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog.display" max-width="500px">
        <v-card>
          <v-card-title><h5>Update status verbal</h5></v-card-title>
          <v-divider/>
          <v-card-text>
            Anda akan mengubah status verbal agenda: {{ dialog.item.nomorAgenda }}
            <v-select
              label="Status Baru"
              required
              v-model="dialog.status"
              :items="status"
              return-object
            />
            <v-text-field
              label="Catatan"
              v-model="dialog.note"
              auto-grow
              multi-line
              rows="2"
            />
            <template v-if="dialog.status && dialog.status.text === 'Arsipkan'">
              <v-divider/>
              Penomoran Naskah Dinas: 
              <v-layout row v-for="naskah in dialog.item.naskah" :key="naskah.key">
                <v-flex xs4>
                  <v-subheader>{{ naskah.jenis }}</v-subheader>
                  {{ naskah.tujuan.join(', ') }}
                </v-flex>
                <v-flex xs>
                  <v-text-field
                    v-model="naskah.nomor"
                  />
                </v-flex>
              </v-layout>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="green darken-1" flat @click.stop="updateVerbal">Update</v-btn>
            <v-btn color="red darken-1" flat @click.stop="closeDialog">Batal</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';
import printHelper from '../helpers/print-perbaikan';

export default {
  data() {
    return {
      filterPanel: false,
      search: '',
      selected: [],
      pagination: { sortBy: null, page: 1, rowsPerPage: 25, descending: false, totalItems: 0 },
      headers: [
        { text: 'No Agenda', value: 'nomorAgenda', align: 'center' },
        { text: 'Tanggal', value: 'tanggal', align: 'center' },
        { text: 'Bagian', value: 'bagian', align: 'center' },
        { text: 'Konseptor', value: 'konseptor', align: 'center' },
        { text: 'Nota&Verbal Bagian', align: 'center', sortable: false },
        { text: 'Perihal', align: 'center', sortable: false },
        { text: 'Diperbarui', value: 'updatedAt', align: 'center', sortable: true },
        { text: 'Status', align: 'center', sortable: false },
        { text: 'Aksi', align: 'center', sortable: false },
      ],
      dialog: {
        display: false,
        item: {},
        status: null,
        note: '',
      },
      status: [
        { text: 'Terima', color: 'yellow', logText: 'Verbal diterima TU Biro' },
        { text: 'Ajukan', color: 'blue', logText: 'Verbal diajukan ke Kepala Biro' },
        { text: 'Setuju', color: 'green', logText: 'Verbal disetujui Kepala Biro' },
        { text: 'Perbaikan', color: 'red', logText: 'Perbaikan verbal oleh TU atau Kepala Biro' },
        { text: 'Arsipkan', color: 'grey', logText: 'Verbal diarsipkan' },
      ],
      now: new Date(),
    };
  },
  computed: {
    verbals() {
      return this.$store.getters.filteredVerbals.slice().reverse();
    },
    pegawai() {
      return this.$store.state.verbal.pegawai;
    },
    filterStatus: {
      get() {
        return this.$store.state.verbal.filters.status;
      },
      set(val) {
        this.$store.commit('setFilterStatus', val);
      },
    },
    statusFilterCheckbox: {
      get() {
        if (this.filterStatus.length === 0) return false;
        else if (this.filterStatus.length >= 6) return true;
        return 'indeterminate';
      },
      set(val) {
        const allStatus = ['Direkam', 'Terima', 'Ajukan', 'Setuju', 'Perbaikan', 'Arsipkan'];
        this.$store.commit('setFilterStatus', val ? allStatus : []);
      },
    },
  },
  methods: {
    idToPegawai(id) {
      return this.pegawai.find(e => e.IDPegawai === id);
    },
    prettyTime(timeString) {
      const date = new Date(timeString);
      const diff = Math.floor(((this.now).getTime() - date.getTime()) / 1000);
      const dayDiff = Math.floor(diff / 86400);

      if (isNaN(dayDiff) || dayDiff < 0) return '';

      return (dayDiff === 0 && (
        (diff < 60 && 'baru saja') ||
        (diff < 120 && 'semenit lalu') ||
        (diff < 3600 && `${Math.floor(diff / 60)} menit lalu`) ||
        (diff < 7200 && 'sejam yang lalu') ||
        (diff < 86400 && `${Math.floor(diff / 3600)} jam lalu`)
      )) ||
      (dayDiff === 1 && 'kemarin') ||
      (dayDiff < 7 && `${dayDiff} hari lalu`) ||
      (dayDiff < 31 && `${Math.ceil(dayDiff / 7)} minggu lalu`) ||
      (dayDiff < 365 && `${Math.ceil(dayDiff / 30)} bulan lalu`);
    },
    openDialog(item) {
      this.dialog.item = item;
      this.dialog.display = true;
    },
    closeDialog() {
      this.dialog.item = {};
      this.dialog.display = false;
      this.dialog.status = null;
      this.dialog.note = '';
    },
    updateVerbal() {
      const newStatus = { ...this.dialog.status, uid: this.dialog.item['.key'], note: this.dialog.note, naskah: this.dialog.item.naskah };
      this.$store.dispatch('updateVerbalStatus', newStatus);
      this.closeDialog();
    },
    printPerbaikan(item) {
      const data = {};
      data.nomorAgenda = item.nomorAgenda;
      data.tanggal = new Date(item.tanggal).toLocaleDateString('id', { year: 'numeric', month: 'long', day: 'numeric' });
      data.bagian = item.bagian;
      data.konseptor = this.idToPegawai(item.konseptor).NamaLengkap;
      data.notaBag = item.notaBagian;
      data.verbBag = item.verbBagian;
      data.perihal = item.perihal;
      data.catatan = Object.values(item.log).pop().note;
      printHelper(data);
    },
    blurFilterCheckbox() {
      this.filterPanel = false;
    },
  },
  directives: {
    ClickOutside,
  },
  created() {
    setInterval(() => { this.now = new Date(); }, 60000);
  },
};
</script>

<style>
.nowrap {
  white-space: nowrap;
}
</style>
