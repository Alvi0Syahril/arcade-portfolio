import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginFormUI } from './LoginFormUI';

export const Login: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    isSuccess,
    userData,
    handleSubmit
  } = useLoginForm();

  return (
    <LoginFormUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      errors={errors}
      isLoading={isLoading}
      isSuccess={isSuccess}
      userData={userData}
      onSubmit={handleSubmit}
    />
  );
};
