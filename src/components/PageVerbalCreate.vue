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
              :items="bagian"
            />
            <v-layout row>
              <v-flex xs5>
                <v-text-field
                  label="Nomor Nota Dinas Bagian"
                  prepend-icon="description"
                  v-model="form.notaBagian"
                />
              </v-flex>
              <v-flex xs6 offset-xs1>
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
            <v-alert color="warning" icon="priority_high" :value="!!error.naskah">{{ error.naskah }}</v-alert>
            <v-layout>
              <v-flex xs2 offset-xs1>
                <v-select
                  label="Jenis Naskah"
                  v-model="naskahInput.jenis"
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
                />
              </v-flex>
              <v-flex xs2>
                <v-btn @click="addNaskah">Tambah</v-btn>
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
        jenis: '',
        tujuan: [],
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
          jenis: '',
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
      data.forEach((e) => {
        if (!this.tujuan.includes(e)) {
          this.$store.dispatch('addTujuan', e);
        }
      });
    },
    checkLabel(data) {
      data.forEach((e) => {
        if (!this.labels.includes(e)) {
          this.$store.dispatch('addLabel', e);
        }
      });
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
    },
    save() {
      this.validateInput();
      if (this.valid) {
        this.$store.dispatch('saveNewVerbal', { ...this.form, createdAt: Date.now(), createdBy: this.$store.state.auth.user.uid });
      }
    },
  },
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
  },
  mounted() {
    const d = new Date();
    this.form.tanggal = d.toISOString().substr(0, 10);
  },
};
</script>

