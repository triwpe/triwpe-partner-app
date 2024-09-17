'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import * as partnerAccountApi from '@/services/api/partnerAccountApi';
import { getLoggedPartner } from '@/actions/partner';
import { PartnerModel } from '@/types/models/partner';

interface UserContextType {
  user: PartnerModel | null;
  setUser: (user: PartnerModel | null) => void;
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
  const [user, setUser] = useState<PartnerModel | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { success, data } = await getLoggedPartner();

        console.log('AQUIIIIIII', data);

        if (!data) {
          setUser(null);
          return;
        }

        setUser(data);
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
