import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  readonly backgroundColor?: string;
  readonly color?: string;
  readonly onClick?: () => void;
  readonly size?: string;
  readonly content: string;
}

const Container = styled.button<{
  backgroundColor?: string;
  size?: string;
}>`
  padding: ${props => (props.size === 'small' ? '0.3em' : '0.6em')};
  background-color: ${props =>
    props.backgroundColor === 'red' ? '#FF5959' : '#E0E0E0'};
  border: none;
  border-radius: 0.3em;
  cursor: pointer;
`;

const Content = styled.span<{ color?: string }>`
  color: ${props => (props.color === 'white' ? '#fff' : '#000')};
`;

export const Button = ({
  backgroundColor = '#E0E0E0',
  color = '#000',
  onClick,
  size,
  content,
}: ButtonProps) => {
  return (
    <Container
      backgroundColor={backgroundColor}
      color={color}
      onClick={onClick}
      size={size}
      data-testid="container-element"
    >
      <Content color={color}>{content}</Content>
    </Container>
  );
};
