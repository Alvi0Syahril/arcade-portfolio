import { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/loginValidation';
import { login } from '../services/authService';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<{ id: string; email: string; token?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Apply validation
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    try {
      const response = await login(email, password);
      console.log('Login successful', response);
      setIsSuccess(true);
      setUserData({ ...response.user, token: response.token });
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    isSuccess,
    userData,
    handleSubmit
  };
};
