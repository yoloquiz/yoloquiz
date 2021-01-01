<template>
  <Wallpaper>
    <div class="container mx-auto px-4 h-full">
      <div class="flex content-center items-center justify-center h-full">
        <div class="w-full lg:w-4/12 px-4">
          <Card>
            <div class="flex-auto px-4 lg:px-10 py-10">
              <Form id="reset-password-form" @submit.prevent="resetPassword">
                <div class="flex flex-wrap" v-if="!isProfileComplete">
                  <div class="w-1/2 pr-2">
                    <InputText v-model="form.firstName" autofocus label="Prénom" :rules="textRules" />
                  </div>
                  <div class="w-1/2 pl-2">
                    <InputText v-model="form.lastName" label="Nom" :rules="textRules" />
                  </div>
                </div>
                <InputText v-model="form.password" label="Mot de passe" type="password" :rules="passwordRules" />
                <div class="text-center mt-3">
                  <Button form="reset-password-form" :loading="isResetLoading">Confirmer</Button>
                </div>
              </Form>
            </div>
          </Card>
          <div class="flex flex-wrap mt-6">
            <div class="w-1/2 text-left">
              <router-link to="/register" class="text-gray-300"><small>Nouveau ?</small></router-link>
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
import { mapGetters } from 'vuex';
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
    Form,
    InputText,
    Button,
  },
  data: () => ({
    isResetLoading: false,
    emailRules: [getIsRequiredRule(), getIsEmailRule()],
    textRules: [getIsRequiredRule()],
    passwordRules: [getIsRequiredRule(), getIsLengthRule()],
    form: {
      password: undefined,
      firstName: undefined,
      lastName: undefined,
    },
    ...mapGetters({
      form: (state) => {
        const defaultForm = { password: undefined, firstName: undefined, lastName: undefined };
        const currentUser = state.getters['auth/currentUser'];
        if (!currentUser) return defaultForm;
        const { firstName, lastName } = currentUser;
        return {
          ...defaultForm,
          firstName,
          lastName,
        };
      },
    }),
  }),
  computed: {
    ...mapGetters({
      isProfileComplete: 'auth/isProfileComplete',
    }),
  },
  methods: {
    async resetPassword() {
      this.isResetLoading = true;
      try {
        const { password, firstName, lastName } = this.form;
        await this.$store.dispatch('auth/resetPassword', { password });
        if (!this.isProfileComplete) {
          await this.$store.dispatch('auth/updateProfile', { firstName, lastName });
        }
        this.$router.push('/auth');
      } catch (error) {
        console.error(error);
      }
      this.isResetLoading = false;
    },
  },
};
</script>

<style></style>
