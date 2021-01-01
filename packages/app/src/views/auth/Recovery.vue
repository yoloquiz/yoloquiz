<template>
  <Wallpaper>
    <div class="container mx-auto px-4 h-full">
      <div class="flex content-center items-center justify-center h-full">
        <div class="w-full lg:w-4/12 px-4">
          <Card v-if="isRecoverySent">
            <div class="py-16 px-4 flex flex-col items-center">
              <i class="far fa-3x fa-envelope mb-4"></i>
              <h1 class="mb-4 text-3xl font-bold">Email envoyé</h1>
              <p class="mb-8">
                Veuillez consulter vos mails pour réinitialiser votre mot de passe 👍
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
            <div class="flex-auto px-4 lg:px-10 py-10">
              <Form id="recovery-form" @submit.prevent="login">
                <InputText
                  v-model="form.email"
                  placeholder="email@exemple.com"
                  label="E-mail"
                  autofocus
                  :rules="emailRules"
                />
                <div class="text-center mt-3">
                  <Button form="recovery-form" :loading="isRecoveryLoading">Réinitialiser</Button>
                </div>
              </Form>
            </div>
          </Card>
          <div class="flex flex-wrap mt-6">
            <div class="w-1/2 text-left">
              <router-link to="/register" class="text-gray-300"><small>S'inscrire</small></router-link>
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

import Wallpaper from '@/components/layouts/Wallpaper.vue';
import Card from '@/components/ui/Card.vue';
import Form from '@/components/ui/form/Form.vue';
import InputText from '@/components/ui/form/InputText.vue';
import Button from '@/components/ui/form/Button.vue';

export default {
  components: {
    Wallpaper,
    Card,
    InputText,
    Button,
    Form,
  },
  data: () => ({
    isRecoveryLoading: false,
    isRecoverySent: false,
    emailRules: [getIsRequiredRule(), getIsEmailRule()],
    passwordRules: [getIsRequiredRule(), getIsLengthRule()],
    form: {
      email: undefined,
    },
  }),
  emailProviderUrl() {
    const domainUrl = _(this.form.email)
      .split('@')
      .nth(1);
    return `https://${domainUrl || 'gmail.com'}`;
  },
  methods: {
    async login() {
      this.isRecoveryLoading = true;
      try {
        await this.$store.dispatch('auth/recovery', this.form);
        this.isRecoverySent = true;
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        this.isRecoveryLoading = false;
      }, 300);
    },
  },
};
</script>

<style></style>
