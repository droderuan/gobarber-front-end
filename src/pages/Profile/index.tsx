import React, { useCallback, useRef, ChangeEvent } from 'react';
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
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('E-mail is required')
            .email('Digit a valid e-mail'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required().min(6),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('This field is required'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), null],
              'Password confirmation does not match',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/signin');

        addToast({
          type: 'sucess',
          title: `Profile updated`,
          description: 'Your profile was updated with sucess',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          addToast({
            type: 'error',
            title: `Error.`,
            description:
              'A error ocurr while trying to update your profile. Please try again.',
          });

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Error on update',
          description: 'Fail to update your profile, try again',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);

        api
          .patch('/users/avatar', data)
          .then(response => {
            updateUser(response.data);

            addToast({
              type: 'sucess',
              title: 'Avatar atualizado',
              description: 'O avatar foi atualizado com sucesso',
            });
          })
          .catch(() =>
            addToast({
              type: 'error',
              title: 'Error',
              description:
                'Ocorreu um error ao tentar atualizar o avatar. Tente novamente.',
            }),
          );
      }
    },
    [addToast, updateUser],
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

            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
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
            name="password_confirmation"
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
