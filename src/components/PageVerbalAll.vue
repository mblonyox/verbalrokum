<template>
  <div id="page-verbal">
    <v-layout>
      <v-flex md4/>
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
        <template slot="items" scope="props">
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
            />
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
        { text: 'Perbaikan', color: 'red', logText: 'Perbaikan verbal oleh Kepala Biro' },
        { text: 'Arsipkan', color: 'blue-grey', logText: 'Verbal diarsipkan' },
      ],
    };
  },
  computed: {
    verbals() {
      return this.$store.state.verbal.verbals.sort((a, b) => a['.key'] < b['.key']);
    },
    pegawai() {
      return this.$store.state.verbal.pegawai;
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
    },
    updateVerbal() {
      const newStatus = { ...this.dialog.status, uid: this.dialog.item['.key'], note: this.dialog.note };
      this.$store.dispatch('updateVerbalStatus', newStatus);
      this.closeDialog();
    },
  },
};
</script>
