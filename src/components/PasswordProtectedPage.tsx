import React, { useState, useEffect } from 'react';
import { useBusinessAccess } from '../contexts/BusinessAccessContext';
import '../styles/PasswordProtectedPage.css';
import { FaLock, FaUnlock, FaExclamationTriangle } from 'react-icons/fa';

interface PasswordProtectedPageProps {
  businessId: string;
  children: React.ReactNode;
  customMessage?: string;
}

export const PasswordProtectedPage: React.FC<PasswordProtectedPageProps> = ({
  businessId,
  children,
  customMessage
}) => {
  const { 
    isBusinessPasswordProtected, 
    validateBusinessPassword,
    getBusinessPassword
  } = useBusinessAccess();
  
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  
  // Check if the page is password protected
  const isProtected = isBusinessPasswordProtected(businessId);
  
  // Check if there's a stored authentication state in session storage
  useEffect(() => {
    const storedAuth = sessionStorage.getItem(`password_auth_${businessId}`);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, [businessId]);
  
  // If the page is not password protected, render children directly
  if (!isProtected) {
    return <>{children}</>;
  }
  
  // If already authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateBusinessPassword(businessId, password)) {
      setIsAuthenticated(true);
      setError('');
      // Store authentication state in session storage
      sessionStorage.setItem(`password_auth_${businessId}`, 'true');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };
  
  const togglePasswordHint = () => {
    setShowPasswordHint(!showPasswordHint);
  };
  
  return (
    <div className="password-protected-container">
      <div className="password-protected-overlay">
        <div className="password-protected-content">
          <div className="password-protected-icon">
            <FaLock />
          </div>
          
          <h2>Password Protected</h2>
          
          <p className="password-protected-message">
            {customMessage || 'This page is password protected. Please enter the password to continue.'}
          </p>
          
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="password-input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-input"
              />
              <button type="submit" className="password-submit-button">
                <FaUnlock /> Unlock
              </button>
            </div>
            
            {error && (
              <div className="password-error">
                <FaExclamationTriangle /> {error}
              </div>
            )}
          </form>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="password-hint-container">
              <button 
                className="password-hint-toggle" 
                onClick={togglePasswordHint}
              >
                {showPasswordHint ? 'Hide Password Hint' : 'Show Password Hint (Dev Only)'}
              </button>
              
              {showPasswordHint && (
                <div className="password-hint">
                  <p>Development Mode: The correct password is: <strong>{getBusinessPassword(businessId)}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 