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
          <td>{{ props.item['.key'] }}</td>
          <td>{{ props.item.tanggal }}</td>
          <td>{{ props.item.konseptor }}</td>
          <td>{{ props.item.perihal }}</td>
          <td>{{ props.item.lampiran }}</td>
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
        { text: 'No Agenda', value: 'agenda' },
        { text: 'Tanggal', value: 'tanggal' },
        { text: 'Konseptor', value: 'konseptor' },
        { text: 'Perihal', value: 'perihal', align: 'left', sortable: false },
        { text: 'Lampiran', value: 'lampiran', align: 'left', sortable: false },
        { text: 'Status', value: 'status', align: 'left', sortable: false },
      ],
    };
  },
  computed: {
    verbals() {
      return this.$store.state.verbal.verbals;
    },
  },
  created() {
    this.$store.dispatch('initVerbalRef');
  },
};
</script>
