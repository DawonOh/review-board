import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import 'jest-styled-components';
import { Login } from '.';
import { MemoryRouter as Router } from 'react-router-dom';

test('Login render correctly', () => {
  let isModalOpen = true;
  const setIsModalOpen = (props: boolean) => {
    isModalOpen = props;
  };
  const { container } = render(
    <Router>
      <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Router>
  );
  const loginModal = screen.getByTestId('Login Test');
  expect(loginModal).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test('enable button when email and password are entered', () => {
  let isModalOpen = true;
  const setIsModalOpen = (props: boolean) => {
    isModalOpen = props;
  };
  render(
    <Router>
      <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Router>
  );
  const emailInput = screen.getByPlaceholderText('이메일을 입력해주세요.');
  const passwordInput = screen.getByPlaceholderText('비밀번호를 입력해주세요.');
  const button = screen.getByRole('button');

  expect(button).toBeDisabled();

  fireEvent.change(emailInput, { target: { value: 'example@email.com' } });
  fireEvent.change(passwordInput, { target: { value: 'test1234!' } });

  expect(button).toBeEnabled();
});

test('can not login when button is disabled', () => {
  const login = jest.fn();
  let isModalOpen = true;
  const setIsModalOpen = (props: boolean) => {
    isModalOpen = props;
  };
  render(
    <Router>
      <Login isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Router>
  );

  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(login).toHaveBeenCalledTimes(0);
});
