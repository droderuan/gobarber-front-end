import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
  type?: 'info' | 'sucess' | 'error';
  hasDescription: boolean;
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  sucess: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ToastProps>`
  width: 360px;
  position: relative;
  padding: 16px 30px 16px 16px;
  display: flex;

  border-radius: 10px;
  background: #ebf8ff;
  color: #3172b7;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

  ${props => toastTypeVariations[props.type || 'info']}

  & + div {
    margin-top: 8px;
  }

  > svg {
    margin-top: 4px;
    margin-right: 12px;
  }

  div {
    flex: 1;
    p {
      margin-top: 4px;
      line-height: 20px;

      font-size: 14px;
      opacity: 0.8;
    }
  }

  button {
    position: absolute;
    right: 16px;
    top: 20px;

    background: transparent;
    color: #c53030;
    border: 0;
  }

  ${props =>
    !props.hasDescription &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;
