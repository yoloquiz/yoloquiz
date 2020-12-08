<template>
  <Wallpaper fixed>
    <div class="container mx-auto px-4 h-full">
      <div class="flex content-center items-center justify-center h-full">
        <div class="w-full lg:w-4/12 px-4">
          <Card v-if="isEmailConfirmationRequired">
            <div class="py-16 px-4 flex flex-col items-center">
              <i class="far fa-3x fa-envelope mb-4"></i>
              <h1 class="mb-4 text-3xl font-bold">Email envoyé</h1>
              <p class="mb-8">
                Veuillez confirmer votre compte afin d'accéder à l'application 🙏
              </p>
              <a
                :href="emailProviderUrl"
                rel="noopener noreferrer"
                class="rounded text-xl bg-gray-900 text-white px-4 py-2"
              >
                Accéder à mes mails
              </a>
            </div>
          </Card>
          <Card v-else>
            <div class="rounded-t mb-0 px-6 py-6">
              <div class="text-center mb-3">
                <h6 class="text-gray-600 text-sm font-bold">
                  Sign in with
                </h6>
              </div>
              <OauthBar />
              <hr class="mt-6 border-b-1 border-gray-400" />
            </div>
            <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
              <Form id="register-form" @submit.prevent="register">
                <div class="flex flex-wrap">
                  <div class="w-1/2 pr-2">
                    <InputText
                      v-model="form.firstName"
                      autofocus
                      placeholder="Jean"
                      label="Prénom"
                      :rules="textRules"
                    />
                  </div>
                  <div class="w-1/2 pl-2">
                    <InputText v-model="form.lastName" placeholder="Dupont" label="Nom" :rules="textRules" />
                  </div>
                </div>
                <InputText v-model="form.email" placeholder="email@exemple.com" label="E-mail" :rules="emailRules" />
                <InputText
                  v-model="form.password"
                  placeholder="Mot de passe"
                  label="Mot de passe"
                  type="password"
                  :rules="passwordRules"
                />
                <div class="text-center mt-3">
                  <Button form="register-form" :loading="isRegisterLoading">S'inscrire</Button>
                </div>
              </Form>
            </div>
          </Card>
          <div class="flex flex-wrap mt-6">
            <div class="w-1/2 text-left">
              <router-link to="/recovery" class="text-gray-300"><small>Mot de passe oublié ?</small></router-link>
            </div>
            <div class="w-1/2 text-right">
              <router-link to="/login" class="text-gray-300"><small>Se connecter</small></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Wallpaper>
</template>

<script>
import _ from 'lodash-es';
import { getIsRequiredRule, getIsEmailRule, getIsLengthRule } from '@/modules/shared/utils/formValidationRules';

import OauthBar from '@/modules/auth/components/OauthBar.vue';
import Wallpaper from '@/components/layouts/Wallpaper.vue';
import Card from '@/components/ui/Card.vue';
import Form from '@/components/ui/form/Form.vue';
import InputText from '@/components/ui/form/InputText.vue';
import Button from '@/components/ui/form/Button.vue';

export default {
  components: {
    Wallpaper,
    Card,
    Form,
    InputText,
    Button,
    OauthBar,
  },
  data: () => ({
    isRegisterLoading: false,
    isEmailConfirmationRequired: false,
    emailRules: [getIsRequiredRule(), getIsEmailRule()],
    textRules: [getIsRequiredRule()],
    passwordRules: [getIsLengthRule()],
    form: {
      email: undefined,
      password: undefined,
      firstName: undefined,
      lastName: undefined,
    },
  }),
  computed: {
    emailProviderUrl() {
      const domainUrl = _(this.form.email)
        .split('@')
        .nth(1);
      return `https://${domainUrl || 'gmail.com'}`;
    },
  },
  methods: {
    async register() {
      this.isRegisterLoading = true;
      try {
        await this.$store.dispatch('auth/register', this.form);
        this.isEmailConfirmationRequired = true;
        this.$notify.success('Inscription prise en compte !');
      } catch (error) {
        console.error(error);
        this.$notify.error(error.message);
      }
      setTimeout(() => {
        this.isRegisterLoading = false;
      }, 300);
    },
  },
};
</script>

<style></style>
