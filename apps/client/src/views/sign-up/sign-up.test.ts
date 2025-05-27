import { render, screen, waitFor } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import SignUp from './sign-up.vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { HttpResponse, http, delay } from 'msw';
import { server } from '../../../server';
import { api } from '@/lib/api';

const user = userEvent.setup();

const client = new QueryClient();

describe('sign up', () => {
  it('has sign up heder', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });
    const header = screen.getByRole('heading', { name: 'Sign Up' });
    expect(header).toBeInTheDocument();
  });
  it('has username input', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
  });
  it('has email input', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });
  it('has password input', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
  it('has password input type', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
  });

  it('has password repeat input', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument();
  });
  it('has password repeat input type', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    const passwordRepeat = screen.getByLabelText('Password Repeat');
    expect(passwordRepeat).toHaveAttribute('type', 'password');
  });

  it('has signup button', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    const signup = screen.getByRole('button', { name: 'Sign Up' });
    expect(signup).toBeInTheDocument();
  });

  it('disables the button initially', () => {
    render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

    const signup = screen.getByRole('button', { name: 'Sign Up' });
    expect(signup).toBeDisabled();
  });

  describe('when user sets same value for password inputs', () => {
    it('enables button', async () => {
      render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      await user.type(password, 'password');
      await user.type(passwordRepeat, 'password');
      const signup = screen.getByRole('button', { name: 'Sign Up' });
      expect(signup).toBeEnabled();
    });
  });

  describe('when user submits form', () => {
    it('sends, username, email, password to the backend', async () => {
      const spy = vi.spyOn(api, 'post');
      server.use(
        http.post(/users/i, async () => {
          delay(1000);
          return HttpResponse.json({
            message: 'Please check your mailbox to activate your account',
          });
        }),
      );
      render(SignUp, { global: { plugins: [[VueQueryPlugin, { queryClient: client }]] } });

      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      const username = screen.getByLabelText('Username');
      const email = screen.getByLabelText('Email');
      const signup = screen.getByRole('button', { name: 'Sign Up' });

      await user.type(password, 'password');
      await user.type(passwordRepeat, 'password');
      await user.click(signup);
      await user.type(username, 'marcus');
      await user.type(email, 'user@gmail.com');
      await user.type(passwordRepeat, 'd');
      await user.type(passwordRepeat, '{Backspace}');
      await user.click(signup);
      expect(await screen.findByRole('status')).toBeInTheDocument();
      await waitFor(() => expect(signup).toBeDisabled());
      await waitFor(() => expect(spy).toHaveBeenCalled());
      await waitFor(() =>
        expect(spy).toHaveBeenCalledWith('/users', {
          email: 'user@gmail.com',
          password: 'password',
          username: 'marcus',
        }),
      );
      expect(signup).toBeDisabled();
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Please check your mailbox to activate your account',
      );
    });
  });
});
