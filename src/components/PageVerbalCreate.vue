<template>
  <div id="page-verbal-create">
    <v-card>
      <v-layout>
        <v-flex xs10 offset-xs1>
          <v-form v-model="valid">
            <v-menu
              lazy
              v-model="datepicker"
              offset-y
            >
              <v-text-field
                slot="activator"
                label="Tanggal"
                prepend-icon="event"
                :value="new Date(form.tanggal).toLocaleDateString('id', { year: 'numeric', month: 'long', day: 'numeric' })"
                readonly
              />
              <v-date-picker
                locale="id-ID"
                v-model="form.tanggal"
                no-title
              />
            </v-menu>
            <v-select
              label="Bagian"
              prepend-icon="domain"
              v-model="form.bagian"
              :items="bagians"
            />
            <v-text-field
              label="Nomor Nota Dinas Bagian"
              prepend-icon="description"
              v-model="form.notaBagian"
            />
            <v-text-field
              label="Nomor Verbal Bagian"
              prepend-icon="receipt"
              v-model="form.verbBagian"
            />
            <v-select
              label="Konseptor"
              prepend-icon="person"
              v-model="form.konseptor"
              :items="pegawai"
              autocomplete
            />
            <v-select
              label="Jenis Naskah"
              prepend-icon="layers"
              v-model="form.jenis"
              tags
              chips
            />
            <v-text-field
              label="Perihal"
              prepend-icon="message"
              v-model="form.perihal"
              multi-line
            />
            <v-text-field
              label="Lampiran"
              prepend-icon="attachment"
              v-model="form.lampiran"
            />
            <v-btn @click="save">Simpan</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      valid: false,
      form: {
        tanggal: null,
        perihal: '',
        jenis: [],
        lampiran: '',
        konseptor: '',
        bagian: '',
        notaBagian: '',
        verbBagian: '',
      },
      datepicker: false,
      bagians: [],
      pegawai: [],
    };
  },
  methods: {
    save() {
      this.$store.dispatch('saveNewVerbal', { ...this.form, createdAt: Date.now(), createdBy: this.$store.state.auth.user.uid });
    },
  },
  mounted() {
    const d = new Date();
    this.form.tanggal = d.toISOString().substr(0, 10);
    firebase.database().ref('/bagians').once('value', (snap) => {
      this.bagians = snap.val();
    });
  },
};
</script>

