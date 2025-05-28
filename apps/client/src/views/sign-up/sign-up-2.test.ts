import { render, screen, waitFor } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import SignUp from './sign-up.vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { HttpResponse, http, delay } from 'msw';
import { server } from '../../../server';
import { api } from '@/lib/api';

const user = userEvent.setup();

const client = new QueryClient();

const setup = async () => {
  render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

  const password = screen.getByLabelText('Password');
  const passwordRepeat = screen.getByLabelText('Password Repeat');
  const username = screen.getByLabelText('Username');
  const email = screen.getByLabelText('Email');
  const signup = screen.getByRole('button', { name: 'Sign Up' });

  await user.type(password, 'password');
  await user.type(passwordRepeat, 'password');
  await user.type(username, 'marcus');
  await user.type(email, 'user@gmail.com');
  return {
    elements: {
      button: signup,
    },
  };
};

const setup2 = async () => {
  const { debug } = render(SignUp, {
    global: { plugins: [[VueQueryPlugin, { queryClient: client }]] },
  });

  const password = screen.getByLabelText('Password');
  const passwordRepeat = screen.getByLabelText('Password Repeat');
  const username = screen.getByLabelText('Username');
  const email = screen.getByLabelText('Email');
  const signup = screen.getByRole('button', { name: 'Sign Up' });

  await user.type(password, 'password');
  await user.type(passwordRepeat, 'password');
  return {
    debug,
    elements: {
      password,
      passwordRepeat,
      username,
      email,
      signup,
    },
  };
};

describe('sign up', () => {
  describe('when username is invalid', () => {
    it('displays validation error', async () => {
      const {
        elements: { signup, username },
      } = await setup2();

      await user.click(signup);
      expect(await screen.findByText('Username is Required')).toBeInTheDocument();
      await user.type(username, 'marcus');
      waitFor(() => expect(screen.queryByText('Username is Required')).not.toBeInTheDocument());
    });
  });

  describe('when email is invalid', () => {
    it('displays validation error', async () => {
      const {
        elements: { signup, email },
      } = await setup2();
      await user.click(signup);
      expect(await screen.findByText('Email is Required')).toBeInTheDocument();
      await user.type(email, 'marcus');
      expect(screen.getByText('Email is Required')).toBeInTheDocument();
      await user.type(email, '@gmail.com');
      waitFor(() => expect(screen.queryByText('Email is Required')).not.toBeInTheDocument());
    });
  });
});
