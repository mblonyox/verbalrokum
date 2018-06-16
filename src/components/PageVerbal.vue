<template>
  <div id="page-detil">
    <v-card>
      <v-card-title><h4>Detil verbal</h4></v-card-title>
      <v-divider/>
      <v-card-text>
        <v-tabs grow>
          <v-tab href="#tab-rincian">Rincian</v-tab>
          <v-tab href="#tab-logs">Logs</v-tab>
          <v-tab href="#tab-files">Files</v-tab>
          <v-tabs-items>
            <v-tab-item id="tab-rincian">
              <br>
              <v-layout row>
                <v-flex xs4><v-subheader>Nomor Agenda</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.nomorAgenda }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Tanggal</v-subheader></v-flex>
                <v-flex xs8>{{ formatDate(verbal.tanggal) }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Bagian</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.bagian }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Konseptor</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.konseptorNama }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Nota Bagian</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.notaBagian }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Verbal Bagian</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.verbBagian }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Perihal</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.perihal }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Lampiran</v-subheader></v-flex>
                <v-flex xs8>{{ verbal.lampiran }}</v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Naskah Dinas</v-subheader></v-flex>
                <v-flex xs8>
                  <v-list>
                    <v-list-tile v-for="naskah in verbal.naskah" :key="naskah.key">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ naskah.jenis }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ naskah.tujuan.join(', ') }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4><v-subheader>Status</v-subheader></v-flex>
                <v-flex xs8> <v-chip :color="verbal.status.color" text-color="white">{{ verbal.status.text }}</v-chip></v-flex>
              </v-layout>
              <div class="text-xs-center">
                <v-btn :to="{name: 'EditVerbal', params: { id: $route.params.id }}" color="cyan">Edit</v-btn>
                <v-btn to="/verbal">Kembali</v-btn>
              </div>
            </v-tab-item>
            <v-tab-item id="tab-logs">
              <br>
              <v-data-table
                :headers="headers"
                :items="logs"
                hide-actions
              >
                <template slot="items" slot-scope="props">
                  <td>{{ formatTime(props.item.time) }}</td>
                  <td>{{ props.item.user }}</td>
                  <td>{{ props.item.text }}</td>
                  <td>{{ props.item.note }}</td>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Time', value: 'time', align: 'center' },
        { text: 'User', align: 'center', sortable: false },
        { text: 'Action', align: 'center', sortable: false },
        { text: 'Note', align: 'center', sortable: false },
      ],
    };
  },
  computed: {
    verbal() {
      const uid = this.$route.params.id;
      return this.$store.state.verbal.verbals.find(e => e['.key'] === uid);
    },
    logs() {
      return Object.values(this.verbal.log);
    },
  },
  methods: {
    formatTime(time) {
      return new Date(time).toLocaleString('id');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id', { year: 'numeric', month: 'long', day: 'numeric' });
    },
  },
};
</script>
