// UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MemberShipService } from '../services/MemberShipService';
import { useAuth } from 'react-native-auth-component';


// Define the user details interface
interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  apps: { appName: string }[];
}

// Define the context value type for user-related functions
interface UserContextType {
  userDetails: UserDetails | null;
  fetchUserDetails: () => Promise<boolean>;
}

// Create the user context
const UserContext = createContext<UserContextType | undefined>(undefined);
const memberShipService = MemberShipService.instance()
export const UserProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    if (user?.access_token) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const fetchedUserDetails = await memberShipService.getProfile();
      setUserDetails(fetchedUserDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userDetails, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
