<template>
  <div id="page-verbal-create">
    <v-card>
      <v-layout>
        <v-flex xs10 offset-xs1>
          <h3 v-if="editMode">Edit Verbal</h3>
          <h3 v-else>Rekam Verbal Baru</h3>
          <h4 v-if="editMode">Nomor Agenda : {{ verbal.nomorAgenda }}</h4>
          <v-form ref="form" v-model="valid">
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
              :items="bagian"
              :rules="rules.bagian"
              required
            />
            <v-layout row wrap>
              <v-flex xs12 md5>
                <v-text-field
                  label="Nomor Nota Dinas Bagian"
                  prepend-icon="description"
                  v-model="form.notaBagian"
                />
              </v-flex>
              <v-flex xs12 md6 offset-md1>
                <v-text-field
                  label="Nomor Verbal Bagian"
                  prepend-icon="receipt"
                  v-model="form.verbBagian"
                />
              </v-flex>
            </v-layout>
            <v-select
              label="Konseptor"
              prepend-icon="person"
              v-model="form.konseptor"
              :items="pegawai"
              item-text="NamaLengkap"
              item-value="IDPegawai"
              :rules="rules.konseptor"
              required
              autocomplete
            />
            <v-divider/>
            <v-list two-line>
              <v-subheader>Konsep Naskah</v-subheader>
              <v-layout>
                <v-flex xs12 md6>
                  <v-list-tile avatar v-for="item in form.naskah" :key="item.key">
                    <v-list-tile-avatar>
                      <v-icon class="blue white--text">{{ getInitial(item.jenis) }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.jenis"/>
                      <v-list-tile-sub-title v-html="item.tujuan.join(', ')"/>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn icon ripple @click="deleteNaskah(item)">
                        <v-icon color="grey lighten-1">delete</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-flex>
              </v-layout>
            </v-list>
            <v-alert color="error" icon="priority_high" :value="!!error.naskah">{{ error.naskah }}</v-alert>
            <v-layout>
              <v-flex xs2 offset-xs1>
                <v-select
                  label="Jenis Naskah"
                  v-model="naskahInput.jenis"
                  combobox
                  :items="jenis"
                />
              </v-flex>
              <v-flex xs6 offset-xs1>
                <v-select
                  label="Tujuan"
                  v-model="naskahInput.tujuan"
                  :items="tujuan"
                  tags
                  multiple
                  @change="checkTujuan"
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      close
                      @input="data.parent.selectItem(data.item)"
                    >
                      {{ naskahInput.tujuan.indexOf(data.item) + 1}}.
                      {{data.item}}
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs2>
                <v-btn @click="addNaskah" class="hidden-sm-and-down">Tambah</v-btn>
                <v-btn @click="addNaskah" class="hidden-md-and-up" fab outline small>
                  <v-icon>add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-divider/>
            <v-select
              label="Tag Label"
              prepend-icon="local_offer"
              v-model="form.label"
              :items="labels"
              tags
              chips
              @change="checkLabel"
            />
            <v-text-field
              label="Perihal"
              prepend-icon="message"
              v-model="form.perihal"
              multi-line
              :rules="rules.perihal"
              required
            />
            <v-text-field
              label="Lampiran"
              prepend-icon="attachment"
              v-model="form.lampiran"
            />
            <v-btn @click="save" color="primary">Simpan</v-btn>
            <v-btn :to="editMode ? {name: 'DetailVerbal', params: { id }} : '/verbal' ">Batal</v-btn>
          </v-form>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid: null,
      form: {
        tanggal: null,
        perihal: '',
        naskah: [],
        label: [],
        lampiran: '',
        konseptor: '',
        bagian: '',
        notaBagian: '',
        verbBagian: '',
      },
      naskahInput: {
        jenis: null,
        tujuan: [],
      },
      rules: {
        bagian: [
          v => !!v || 'Bagian wajib diisi.',
        ],
        konseptor: [
          v => !!v || 'Konseptor wajib diisi.',
        ],
        perihal: [
          v => !!v || 'Perihal wajib diisi.',
        ],
      },
      datepicker: false,
      jenis: [
        'Nota Dinas',
        'Surat',
        'Undangan',
        'Surat Tugas',
        'Nota Dinas Rahasia',
        'Surat Rahasia',
      ],
      error: {
        naskah: '',
      },
    };
  },
  methods: {
    addNaskah() {
      if (!this.naskahInput.jenis) {
        this.error.naskah = 'Jenis naskah harus diisi.';
      } else if (!this.naskahInput.tujuan.length) {
        this.error.naskah = 'Tujuan naskah harus diisi.';
      } else {
        this.error.naskah = '';
        this.form.naskah.push(this.naskahInput);
        this.naskahInput = {
          jenis: null,
          tujuan: [],
        };
      }
    },
    deleteNaskah(item) {
      this.form.naskah.splice(this.form.naskah.indexOf(item), 1);
    },
    getInitial(str) {
      let result = '';
      str.split(' ').forEach((word) => {
        result += word.charAt();
      });
      return result;
    },
    checkTujuan(data) {
      if (Array.isArray(data)) {
        data.forEach((e) => {
          if (!this.tujuan.includes(e)) {
            this.$store.dispatch('addTujuan', e);
          }
        });
      }
    },
    checkLabel(data) {
      if (Array.isArray(data)) {
        data.forEach((e) => {
          if (!this.labels.includes(e)) {
            this.$store.dispatch('addLabel', e);
          }
        });
      }
    },
    validateInput() {
      if (this.form.naskah.length < 1) {
        this.error.naskah = 'Naskah tidak boleh kosong.';
        this.valid = false;
      } else if (this.naskahInput.jenis || this.naskahInput.tujuan.length > 0) {
        this.error.naskah = 'Naskah belum ditambahkan.';
        this.valid = false;
      } else {
        this.error.naskah = '';
        this.valid = true;
      }
      if (!this.$refs.form.validate()) this.valid = false;
    },
    save() {
      this.validateInput();
      if (this.valid) {
        if (this.editMode) this.$store.dispatch('editVerbal', { id: this.id, form: this.form });
        else this.$store.dispatch('saveNewVerbal', { ...this.form, createdAt: Date.now(), createdBy: this.$store.state.auth.user.displayName });
      }
    },
  },
  props: ['editMode', 'id'],
  computed: {
    bagian() {
      return this.$store.state.verbal.bagian;
    },
    pegawai() {
      return this.$store.state.verbal.pegawai;
    },
    tujuan() {
      return this.$store.state.verbal.tujuan.map(e => e['.value']);
    },
    labels() {
      return this.$store.state.verbal.labels.map(e => e['.value']);
    },
    verbal() {
      return this.editMode ? this.$store.state.verbal.verbals.find(v => v['.key'] === this.id) : null;
    },
  },
  mounted() {
    if (this.editMode) {
      Object.keys(this.form).forEach((k) => {
        if (this.verbal[k] !== undefined) this.form[k] = this.verbal[k];
      });
    } else {
      const d = new Date();
      this.form.tanggal = d.toISOString().substr(0, 10);
    }
  },
};
</script>

