<template>
  <BContainer class="mt-5 pt-5">
    <BRow class="justify-content-center">
      <BCol md="6">
        <BCard>
          <BCardTitle class="text-center" tag="h1">Sign Up</BCardTitle>
          <BCardText>
            <form v-if="!successMessage" data-testid="form" novalidate @submit="submitHandler">
              <BFormGroup class="mb-3" label-for="username" label="Username">
                <BFormInput
                  :class="{ 'is-invalid': errors.username }"
                  id="username"
                  data-testid="username-input"
                  name="username"
                  v-model="username"
                  v-bind="usernameAttrs"
                />
                <ErrorMessage as="div" class="invalid-feedback" name="username" />
              </BFormGroup>
              <BFormGroup class="mb-3" label-for="email" label="Email">
                <BFormInput
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  data-testid="email-input"
                  name="email"
                  v-model="email"
                  v-bind="emailAttrs"
                  type="email"
                />
                <ErrorMessage as="div" class="invalid-feedback" name="email" />
              </BFormGroup>
              <BFormGroup class="mb-3" label-for="password" label="Password">
                <BFormInput
                  :class="{ 'is-invalid': errors.password }"
                  id="password"
                  data-testid="password-input"
                  name="password"
                  v-model="password"
                  v-bind="passwordAttrs"
                  type="password"
                />
                <ErrorMessage as="div" class="invalid-feedback" name="password" />
              </BFormGroup>
              <BFormGroup class="mb-3" label-for="passwordRepeat" label="Password Repeat">
                <BFormInput
                  :class="{ 'is-invalid': errors.passwordRepeat }"
                  id="passwordRepeat"
                  data-testid="passwordRepeat-input"
                  name="passwordRepeat"
                  v-model="passwordRepeat"
                  v-bind="passwordRepeatAttrs"
                  type="password"
                />
                <ErrorMessage as="div" class="invalid-feedback" name="passwordRepeat" />
              </BFormGroup>
              <BButton :disabled type="submit" variant="primary"
                >Sign Up
                <span
                  v-if="isPending"
                  role="status"
                  class="spinner-border spinner-border-sm"
                ></span>
              </BButton>
            </form>
          </BCardText>
        </BCard>
        <BAlert role="alert" variant="success" :model-value="!!successMessage">{{
          successMessage
        }}</BAlert>
        <BAlert role="alert" variant="danger" :model-value="!!error">{{ error?.message }}</BAlert>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
  import '@/lib/api';
  import { api } from '@/lib/api';
  import { useMutation } from '@tanstack/vue-query';
  import { toTypedSchema } from '@vee-validate/zod';
  import {
    BAlert,
    BButton,
    BCard,
    BCardText,
    BCardTitle,
    BCol,
    BContainer,
    BFormGroup,
    BFormInput,
    BRow,
  } from 'bootstrap-vue-next';
  import { ErrorMessage, useForm } from 'vee-validate';
  import { computed, ref } from 'vue';
  import { z } from 'zod';

  const schema = z
    .object({
      username: z
        .string({ required_error: 'Username is Required' })
        .nonempty('Username is Required'),
      email: z
        .string({ required_error: 'Email is Required' })
        .email('Email is Required')
        .nonempty('Email is Required'),
      password: z
        .string({ required_error: 'Password is Required' })
        .nonempty('Password is Required'),
      passwordRepeat: z
        .string({ required_error: 'Password Repeat is Required' })
        .nonempty('Password Repeat is Required'),
    })
    .refine(
      ({ password, passwordRepeat }) => {
        if (password !== passwordRepeat) {
          return false;
        }
        return true;
      },
      {
        path: ['passwordRepeat'],
        message: 'Password and Password Repeat must Match',
      },
    );

  const { defineField, errors, handleSubmit, values } = useForm({
    validationSchema: toTypedSchema(schema),
  });

  const successMessage = ref<undefined | string>();

  const { mutate, isPending, error } = useMutation<
    { message: string },
    Error,
    Omit<z.infer<typeof schema>, 'passwordRepeat'>
  >({
    mutationKey: ['sign-up'],
    async mutationFn(values) {
      return (await api.post('/users', values)).data;
    },
    onSuccess({ message }) {
      successMessage.value = message;
    },
  });

  const submitHandler = handleSubmit(({ passwordRepeat, ...values }) => {
    mutate(values);
  });

  const disabled = computed(() => {
    return (
      values.password !== values.passwordRepeat ||
      !values.password ||
      !values.passwordRepeat ||
      isPending.value
    );
  });

  const [username, usernameAttrs] = defineField('username');
  const [email, emailAttrs] = defineField('email');
  const [password, passwordAttrs] = defineField('password');
  const [passwordRepeat, passwordRepeatAttrs] = defineField('passwordRepeat');
</script>

<style scoped></style>
