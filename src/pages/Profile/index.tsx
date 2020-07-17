import React, { useCallback, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import api from '../../services/api';

import { useToast } from '../../hooks/Toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/Auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('E-mail is required')
            .email('Digit a valid e-mail'),
          password: Yup.string().min(6, 'Password need at least 6 digits'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/signin');

        addToast({
          type: 'sucess',
          title: `Welcome ${data.name}`,
          description: 'You can already login',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Error on the creation of account',
          description: 'Fail to create account, try again',
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <button type="button">
              <FiCamera />
            </button>
          </AvatarInput>

          <h1>My profile</h1>
          <Input name="name" placeholder="Name" icon={FiUser} />
          <Input name="email" placeholder="E-mail" icon={FiMail} />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            placeholder="Current password"
            type="password"
            icon={FiLock}
          />

          <Input
            name="password"
            placeholder="New password"
            type="password"
            icon={FiLock}
          />

          <Input
            name="confirm_password"
            placeholder="Confirm the new password"
            type="password"
            icon={FiLock}
          />

          <Button type="submit">Confirm changes</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
