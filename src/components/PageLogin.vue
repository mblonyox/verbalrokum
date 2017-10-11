<template>
  <v-layout justify-center align-center>
    <v-dialog 
      persistent 
      :value="true"
      max-width="600"
    >
      <v-card>
        <v-container fluid grid-list-lg>
          <v-layout row>
            <v-flex xs12>
              <v-form 
                v-model="valid"
                ref="form"
                lazy-validation
              >
                <v-text-field
                  label="E-mail address"
                  v-model="email"
                  :rules="emailRules"
                  required
                />
                <v-text-field
                  label="Your password"
                  type="password"
                  v-model="password"
                  :rules="passwordRules"
                  required
                />
                <v-btn 
                  @click="submit"
                  :disabled="!valid"
                >
                  submit
                </v-btn>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length > 8 || 'Password must be more than 8 character',
      ],
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('loginWithEmail', { email: this.email, password: this.password });
      }
    },
  },
};
</script>
