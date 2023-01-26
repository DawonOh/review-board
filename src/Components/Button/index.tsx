import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  readonly backgroundColor?: string;
  readonly color?: string;
  readonly onClick?: () => void;
  readonly size?: string;
  readonly content: string;
  readonly disabled?: boolean;
}

const Container = styled.button<{
  backgroundColor?: string;
  size?: string;
  disabled?: boolean;
}>`
  padding: ${props => props.size};
  background-color: ${props => props.backgroundColor};
  border: none;
  border-radius: 0.3em;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;

const Content = styled.span<{ color?: string }>`
  color: ${props => props.color};
`;

export const Button = ({
  backgroundColor = '#E0E0E0',
  color = '#000',
  onClick,
  size,
  content,
  disabled,
}: ButtonProps) => {
  return (
    <Container
      backgroundColor={backgroundColor}
      color={color}
      onClick={onClick}
      size={size}
      disabled={disabled}
      data-testid="container-element"
    >
      <Content color={color}>{content}</Content>
    </Container>
  );
};
