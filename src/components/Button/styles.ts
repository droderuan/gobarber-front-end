import styled from 'styled-components';

import { shade } from 'polished';

export const Container = styled.button`
  width: 100%;
  height: 56px;
  margin-top: 16px;
  padding: 0 16px;

  background: #ff9000;
  color: #312e38;
  border: 0;
  font-weight: 500;
  border-radius: 10px;
  transition: background-color 0.2s ease-out;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;
