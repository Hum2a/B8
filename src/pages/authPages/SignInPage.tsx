import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createUserProfile } from '../../utils/userProfile';
import Navbar from '../../components/ui/Navbar';
import HamburgerMenu from '../../components/ui/HamburgerMenu';
import Footer from '../../components/ui/Footer';
import { FcGoogle } from 'react-icons/fc';
import '../../styles/AuthPages.css';
import { useIsMobile } from '../../hooks/useIsMobile';
import { checkRateLimit, updateLastActivity, handleError } from '../../utils/security';

// Define FirebaseErrorWithCode type to handle Firebase errors
interface FirebaseErrorWithCode extends Error {
  code: string;
}

export default function SignInPage() {
    const isMobile = useIsMobile();
    const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check rate limiting
    if (!checkRateLimit(formData.email)) {
      setIsBlocked(true);
      setError('Too many login attempts. Please try again in 15 minutes.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      updateLastActivity(); // Set initial session timestamp
      navigate('/');
    } catch (err: unknown) {
      const firebaseError = err as FirebaseErrorWithCode;
      let errorMessage: string;
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          errorMessage = handleError(firebaseError);
          setError(errorMessage);
      }
      console.error('Sign in error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create user profile for new Google sign-in users
        await createUserProfile(
          result.user.uid,
          result.user.email || '',
          result.user.displayName?.split(' ')[0] || '',
          result.user.displayName?.split(' ').slice(1).join(' ') || '',
          {}
        );
      }
      
      updateLastActivity(); // Set initial session timestamp
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = handleError(err as Error);
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}
      
      <div className="auth-container">
        <h2>Sign In</h2>
        {error && <div className="auth-error">{error}</div>}
        {isBlocked && (
          <div className="auth-warning">
            Account temporarily blocked due to too many login attempts.
            Please try again later or reset your password.
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            disabled={isBlocked}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            disabled={isBlocked}
          />
          <button type="submit" disabled={isBlocked}>Sign In</button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <button 
          type="button" 
          onClick={handleGoogleSignIn} 
          className="google-sign-in"
          disabled={isBlocked}
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>
        
        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>

      <Footer />
    </div>
  );
} 