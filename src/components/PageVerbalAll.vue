<template>
  <div id="page-verbal">
    <v-layout>
      <v-flex md2>
        <v-expansion-panel popup class="mb-2">
          <v-expansion-panel-content>
            <div slot="header">Filter Status</div>
            <v-card>
              <v-card-text>
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
      <v-flex md2>

      </v-flex>
      <v-flex md6>
        <v-text-field
          label="Keyword..."
          v-model="search"
          single-line
        />
      </v-flex>
      <v-flex md2/>
    </v-layout>
    <v-card>
      <div>
        <v-btn fab absolute top right dark class="green" to="/verbal/rekam">
          <v-icon>add</v-icon>
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="verbals"
        :pagination.sync="pagination"
        :rows-per-page-items="[25, 50, 100, {text: 'All', value: -1}]"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td><router-link :to="'/verbal/'+props.item['.key']">{{ props.item.nomorAgenda }}</router-link></td>
          <td>{{ props.item.tanggal }}</td>
          <td>{{ props.item.bagian }}</td>
          <td>{{ idToPegawai(props.item.konseptor).NamaLengkap }}</td>
          <td><span style="white-space: nowrap;">{{ props.item.notaBagian }}</span> <br> <span style="white-space: nowrap;">{{ props.item.verbBagian }}</span> </td>
          <td>{{ props.item.perihal }}</td>
          <td><v-chip :color="props.item.status.color" text-color="white">{{ props.item.status.text }}</v-chip></td>
          <td>
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
export default {
  data() {
    return {
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
  },
  methods: {
    idToPegawai(id) {
      return this.pegawai.find(e => e.IDPegawai === id);
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
  },
};
</script>
