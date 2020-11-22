<template>
  <div class="container mx-auto h-full py-16">
    <Card title="Connexion" class="w-3/6">
      <Form id="login-form" @submit.prevent="login">
        <InputText v-model="form.email" label="Email" autofocus :rules="emailRules" />
        <InputText v-model="form.password" label="Mot de passe" type="password" :rules="passwordRules" />
      </Form>
      <template v-slot:footer>
        <Button form="login-form" :loading="isLoginLoading">Se connecter</Button>
      </template>
    </Card>
  </div>
</template>

<script>
import { getIsRequiredRule, getIsEmailRule } from '@/modules/shared/utils/formValidationRules';

import Card from '@/components/ui/Card.vue';
import Form from '@/components/ui/form/Form.vue';
import InputText from '@/components/ui/form/InputText.vue';
import Button from '@/components/ui/form/Button.vue';

export default {
  components: { Card, InputText, Button, Form },
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
