<template>
  <h1>Sign up</h1>
  <BContainer>
    <BRow class="justify-content-center">
      <BCol md="6">
        <Form
          v-slot="{ errors }"
          @submit="console.log($event)"
          :validation-schema="toTypedSchema(schema)"
        >
          <BFormGroup class="mb-3" label-for="username" label="Username">
            <Field
              :class="{ 'is-invalid': errors.username }"
              id="username"
              data-testid="username-input"
              :as="BFormInput"
              name="username"
            />
            <ErrorMessage as="div" class="invalid-feedback" name="username" />
          </BFormGroup>
          <BFormGroup class="mb-3" label-for="email" label="Email">
            <Field
              :class="{ 'is-invalid': errors.email }"
              type="email"
              id="email"
              data-testid="email-input"
              :as="BFormInput"
              name="email"
            />
            <ErrorMessage as="div" class="invalid-feedback" name="email" />
          </BFormGroup>
          <BFormGroup class="mb-3" label-for="password" label="Password">
            <Field
              :class="{ 'is-invalid': errors.password }"
              type="password"
              id="password"
              data-testid="password-input"
              :as="BFormInput"
              name="password"
            />
            <ErrorMessage as="div" class="invalid-feedback" name="password" />
          </BFormGroup>
          <BFormGroup class="mb-3" label-for="passwordRepeat" label="Password Repeat">
            <Field
              :class="{ 'is-invalid': errors.passwordRepeat }"
              type="password"
              id="passwordRepeat"
              data-testid="password-repeat-input"
              :as="BFormInput"
              name="passwordRepeat"
            />
            <ErrorMessage as="div" class="invalid-feedback" name="passwordRepeat" />
          </BFormGroup>
          <BButton type="submit" variant="primary">Submit</BButton>
        </Form>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
  import { BFormInput, BFormGroup, BContainer, BRow, BCol, BButton } from 'bootstrap-vue-next';
  import { Field, Form, ErrorMessage } from 'vee-validate';
  import { toTypedSchema } from '@vee-validate/zod';
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
</script>

<style scoped></style>
