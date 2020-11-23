<template>
  <div>
    <navbar-component></navbar-component>
    <main>
      <section class="absolute w-full h-full">
        <div
          class="absolute top-0 w-full h-full bg-gray-900"
          style="background-size: 100%; background-repeat: no-repeat;"
          :style="{ 'background-image': 'url(' + require('../assets/img/register_bg_2.png') + ')' }"
        ></div>
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-4/12 px-4">
              <Card>
                <div class="rounded-t mb-0 px-6 py-6">
                  <div class="text-center mb-3">
                    <h6 class="text-gray-600 text-sm font-bold">
                      Sign in with
                    </h6>
                  </div>
                  <div class="btn-wrapper text-center">
                    <button
                      class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                      type="button"
                      style="transition: all 0.15s ease 0s;"
                    >
                      <img alt="..." class="w-5 mr-1" src="@/assets/img/github.svg" />Github</button
                    ><button
                      class="bg-white active:bg-gray-100 text-gray-800 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
                      type="button"
                      style="transition: all 0.15s ease 0s;"
                    >
                      <img alt="..." class="w-5 mr-1" src="@/assets/img/google.svg" />Google
                    </button>
                  </div>
                  <hr class="mt-6 border-b-1 border-gray-400" />
                </div>
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-gray-500 text-center mb-3 font-bold">
                    <small>Or sign in with credentials</small>
                  </div>
                  <Form id="login-form" @submit.prevent="login">
                    <InputText v-model="form.email" label="Email" autofocus :rules="emailRules" />
                    <InputText v-model="form.password" label="Mot de passe" type="password" :rules="passwordRules" />
                    <div class="text-center mt-3">
                      <Button form="login-form" :loading="isLoginLoading">Sign In</Button>
                    </div>
                  </Form>
                </div>
              </Card>
              <div class="flex flex-wrap mt-6">
                <div class="w-1/2 text-left">
                  <a href="#!" class="text-gray-300"><small>Forgot password?</small></a>
                </div>
                <div class="w-1/2 text-right">
                  <a href="#!" class="text-gray-300"><small>Create new account</small></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer-component></footer-component>
      </section>
    </main>
  </div>
</template>

<script>
import { getIsRequiredRule, getIsEmailRule } from '@/modules/shared/utils/formValidationRules';

import NavbarComponent from '@/components/Navbar.vue';
import FooterComponent from '@/components/Footer.vue';
import Card from '@/components/ui/Card.vue';
import Form from '@/components/ui/form/Form.vue';
import InputText from '@/components/ui/form/InputText.vue';
import Button from '@/components/ui/form/Button.vue';

export default {
  components: {
    NavbarComponent,
    FooterComponent,
    Card,
    InputText,
    Button,
    Form,
  },
  data: () => ({
    isLoginLoading: false,
    emailRules: [getIsRequiredRule(), getIsEmailRule()],
    passwordRules: [(inputValue) => !!inputValue || 'Non'],
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
        this.$router.push('/games/');
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        this.isLoginLoading = false;
      }, 300);
    },
  },
};
</script>

<style></style>
