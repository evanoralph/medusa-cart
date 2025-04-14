import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const auth = useAuthContext();
  return auth;
}; 