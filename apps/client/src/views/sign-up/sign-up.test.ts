import { render, screen } from '@testing-library/vue';
import SignUp from './sign-up.vue';

describe('sign up', () => {
  it('has sign up heder', () => {
    render(SignUp);
    const header = screen.getByRole('heading', { name: 'Sign up' });
    expect(header).toBeInTheDocument();
  });
  it('has username input', () => {
    render(SignUp);
    expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
  });
  it('has email input', () => {
    render(SignUp);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });
  it('has password input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });
  it('has password input type', () => {
    render(SignUp);
    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');
  });

  it('has password repeat input', () => {
    render(SignUp);
    expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument();
  });
  it('has password repeat input type', () => {
    render(SignUp);
    const passwordRepeat = screen.getByLabelText('Password Repeat');
    expect(passwordRepeat).toHaveAttribute('type', 'password');
  });
});
