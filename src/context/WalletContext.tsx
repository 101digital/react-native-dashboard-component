// WalletContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletService } from '../services/WalletService';

// Define the wallet details interface
interface WalletDetails {
  walletId: string;
  balance: number;
  accountNumber: string;
  accountType: string;
  walletName: string;
}

// Define the context value type for wallet-related functions
interface WalletContextType {
  walletDetails: WalletDetails[] | null;
  paging: {
    totalRecords: number;
    pageSize: number;
    pageNumber: number;
  };
  fetchWalletDetails: (page: number, pageSize: number) => Promise<boolean>;
}

// Create the wallet context
const WalletContext = createContext<WalletContextType | undefined>(undefined);
const walletService = WalletService.instance()
export const WalletProvider: React.FC = ({ children }) => {
  const [walletDetails, setWalletDetails] = useState<WalletDetails[] | null>(null);
  const [paging, setPaging] = useState({
    totalRecords: 0,
    pageSize: 10,
    pageNumber: 1,
  });

  const fetchWalletDetails = async (page: number, pageSize: number) => {
    try {
      // Call the wallet service to get wallet details with pagination parameters
      const response = await walletService.getWallets(page, pageSize);

      // Check if the response contains data
      if (response.data && response.data.length > 0) {
        // Map the response data to an array of WalletDetails
        const walletData: WalletDetails[] = response.data.map((wallet: any) => ({
          walletId: wallet.walletId,
          balance: wallet.currentBalance,
          accountNumber: wallet.bankAccount.accountNumber,
          accountType: wallet.bankAccount.accountType,
          walletName: wallet.walletName,
        }));

        // Set the walletDetails state
        setWalletDetails(walletData);

        // Update the paging state
        setPaging({
          totalRecords: response.paging.totalRecords,
          pageSize,
          pageNumber: page,
        });
      }
    } catch (error) {
      console.log('error', error);

      console.error('Error fetching wallet details:', error);
    }
  };

  useEffect(() => {
    // Fetch the initial page of wallet details
    fetchWalletDetails(paging.pageNumber, paging.pageSize);
  }, [paging.pageNumber, paging.pageSize]);

  return (
    <WalletContext.Provider value={{ walletDetails, paging, fetchWalletDetails }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
