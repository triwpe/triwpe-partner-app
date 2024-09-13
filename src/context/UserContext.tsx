'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import * as partnerAccountApi from '@/services/api/partnerAccountApi';
import { getCurrentPartner } from '@/actions/partner';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  // logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const myInfo = await getCurrentPartner();
        console.log('AQUIIIIIII', myInfo);

        if (!myInfo) {
          setUser(null);
          return;
        }

        setUser(myInfo);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // const logout = async () => {
  //   await axios.post('/api/auth/logout');
  //   setUser(null);
  // };

  return (
    // <UserContext.Provider value={{ user, setUser, logout }}>
    //   {children}
    // </UserContext.Provider>
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
