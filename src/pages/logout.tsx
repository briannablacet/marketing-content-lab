import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push('/'); // Redirect to home after logout
  }, [logout, router]);

  return null; // No UI needed for logout
};

export default LogoutPage;