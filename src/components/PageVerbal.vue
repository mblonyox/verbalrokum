<template>
  <div id="page-verbal">
    <v-layout>
      <v-flex md4/>
      <v-flex md6>
        <v-text-field
          label="Keyword..."
          single-line
        />
      </v-flex>
      <v-flex md2/>
    </v-layout>
    <v-card>
      <div>
        <v-btn fab absolute top right dark class="green">
          <v-icon>add</v-icon>
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="verbals"
      >
        <template slot="items" scope="props">
          <td>{{ props.item.nomorAgenda }}</td>
          <td>{{ props.item.tanggal }}</td>
          <td>{{ props.item.bagian }}</td>
          <td>{{ idToPegawai(props.item.konseptor).NamaLengkap }}</td>
          <td>{{ props.item.perihal }}</td>
          <td>{{ props.item.status }}</td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      selected: [],
      headers: [
        { text: 'No Agenda', value: 'agenda', align: 'center' },
        { text: 'Tanggal', value: 'tanggal', align: 'center' },
        { text: 'Bagian', value: 'bagian', align: 'center' },
        { text: 'Konseptor', value: 'konseptor', align: 'center' },
        { text: 'Perihal', value: 'perihal', align: 'center', sortable: false },
        { text: 'Status', value: 'status', align: 'center', sortable: false },
      ],
    };
  },
  computed: {
    verbals() {
      return this.$store.state.verbal.verbals;
    },
    pegawai() {
      return this.$store.state.verbal.pegawai;
    },
  },
  methods: {
    idToPegawai(id) {
      return this.pegawai.find(e => e.IDPegawai === id);
    },
  },
  created() {
    this.$store.dispatch('initVerbalRef');
  },
};
</script>
