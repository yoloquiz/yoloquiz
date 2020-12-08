<template>
  <Wallpaper fixed>
    <div class="container mx-auto px-4 h-full">
      <div class="flex content-center items-center justify-center h-full">
        <div class="w-full lg:w-4/12 px-4">
          <Card>
            <div class="rounded-t mb-0 px-6 py-6">
              <div class="text-center mb-3">
                <h6 class="text-gray-600 text-sm font-bold">
                  Connexion avec
                </h6>
              </div>
              <OauthBar />
              <hr class="mt-6 border-b-1 border-gray-400" />
            </div>
            <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div class="text-gray-500 text-center mb-3 font-bold">
                <small>Ou classiquement</small>
              </div>
              <Form id="login-form" @submit.prevent="login">
                <InputText v-model="form.email" label="E-mail" autofocus :rules="emailRules" />
                <InputText v-model="form.password" label="Mot de passe" type="password" :rules="passwordRules" />
                <div class="text-center mt-3">
                  <Button form="login-form" :loading="isLoginLoading">Se connecter</Button>
                </div>
              </Form>
            </div>
          </Card>
          <div class="flex flex-wrap mt-6">
            <div class="w-1/2 text-left">
              <router-link to="/recovery" class="text-gray-300"><small>Mot de passe oublié ?</small></router-link>
            </div>
            <div class="w-1/2 text-right">
              <router-link to="/register" class="text-gray-300"><small>S'inscrire</small></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Wallpaper>
</template>

<script>
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
    InputText,
    Button,
    Form,
    OauthBar,
  },
  data: () => ({
    isLoginLoading: false,
    emailRules: [getIsRequiredRule(), getIsEmailRule()],
    passwordRules: [getIsRequiredRule(), getIsLengthRule()],
    form: {
      email: undefined,
      password: undefined,
    },
  }),
  methods: {
    async login() {
      this.isLoginLoading = true;
      try {
        await this.$store.dispatch('auth/login', this.form);
        this.$router.push('/auth');
      } catch (error) {
        console.error(error);
        this.$notify.error(error.message);
      }
      setTimeout(() => {
        this.isLoginLoading = false;
      }, 300);
    },
  },
};
</script>

<style></style>
