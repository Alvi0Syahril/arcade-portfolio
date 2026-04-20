import React from 'react';
import './LoginForm.css';

interface LoginFormUIProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  errors: { email?: string; password?: string; general?: string };
  isLoading: boolean;
  isSuccess?: boolean;
  userData?: { email: string } | null;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginFormUI: React.FC<LoginFormUIProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  errors,
  isLoading,
  onSubmit,
  isSuccess,
  userData,
}) => {
  if (isSuccess && userData) {
    return (
      <div className="login-container">
        <div className="login-form-wrapper" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 className="login-title">Login Successful!</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>Welcome aboard, <br/><strong style={{color: '#fff', fontSize: '1.25rem'}}>{userData.email}</strong></p>
          <button className="submit-btn" onClick={() => window.location.reload()}>Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-title">Welcome Back</h2>
        
        {errors.general && <div className="general-error">{errors.general}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
