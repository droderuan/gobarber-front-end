import React, { useRef, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FiLogIn, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/Toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import Logo from '../../assets/logo.svg';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        if (formRef.current) {
          formRef.current.setErrors({});
        }

        const schema = Yup.object().shape({
          password: Yup.string().required('A new password is required'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Password confirmation does not match',
          ),
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        history.push('/signin');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'An error occur',
          description: 'An error occur while trying change password',
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={Logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset password</h1>
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="New password"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Repeat the new password"
            />
            <Button type="submit">Reset</Button>
          </Form>
          <Link to="/signin">
            <FiLogIn />
            Sign in
          </Link>
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default ResetPassword;
