import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import 'jest-styled-components';
import { Button } from '.';

test('renders Button component correctly', () => {
  const { container } = render(<Button content="Button Test" />);
  const content = screen.getByText('Button Test');
  expect(content).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test('renders Container Element correctly', () => {
  render(<Button content="Button Test" />);
  const container = screen.getByTestId('container-element');
  expect(container).toHaveStyleRule('background-color', '#E0E0E0');

  const content = screen.getByText('Button Test');
  expect(content).toHaveStyleRule('color', '#000');
});

test('Button component has backgroundColor,color and size props', () => {
  render(
    <Button
      content="Button Test"
      backgroundColor="#FF5959"
      color="#fff"
      size="0.3em"
    />
  );
  const container = screen.getByTestId('container-element');
  expect(container).toHaveStyleRule('background-color', '#FF5959');
  expect(container).toHaveStyleRule('padding', '0.3em');

  const content = screen.getByText('Button Test');
  expect(content).toHaveStyleRule('color', '#fff');
});

test('click the button', () => {
  const handleClick = jest.fn();
  render(<Button content="Button Test" onClick={handleClick} />);

  const content = screen.getByText('Button Test');
  expect(handleClick).toHaveBeenCalledTimes(0);
  fireEvent.click(content);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
