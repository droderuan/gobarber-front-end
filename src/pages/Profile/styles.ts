import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  > header {
    height: 144px;
    background-color: #28262e;
    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }
  }
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  margin: -175px auto;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;
    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
    }
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  button {
    position: absolute;
    width: 48px;
    height: 48px;
    background-color: #ff9000;
    border-radius: 50%;
    border: none;
    right: 0;
    bottom: 0;

    transition: background-color 0.2s ease-in;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: ${shade(0.2, '#ff9000')};
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
  }
`;
