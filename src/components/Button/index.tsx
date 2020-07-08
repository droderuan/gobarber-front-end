import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...restProps }) => {
  return (
    <Container type="button" {...restProps}>
      {loading ? 'carregando...' : children}
    </Container>
  );
};

export default Button;
