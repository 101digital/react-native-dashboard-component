//ProductInfoContext
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ProductInfoService } from '../services/ProductInfoService'; // Import your ProductInfoService
import { useAuth } from 'react-native-auth-component';

// Define the product info interface
interface ProductInfo {
  // Define the structure of product info as needed
}

// Define the context value type for product info-related functions
interface ProductInfoContextType {
  productInfo: ProductInfo | null;
  fetchProductInfo: (countryCode: string, productCategory: string) => Promise<boolean>;
}

// Create the product info context
const ProductInfoContext = createContext<ProductInfoContextType | undefined>(undefined);
const productInfoService = ProductInfoService.instance(); // Initialize your ProductInfoService

export const ProductInfoProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

  useEffect(() => {
    if (user?.access_token) {
      // Optionally, fetch product info here if needed when the user changes
    }
  }, [user]);

  const fetchProductInfo = async (countryCode: string, productCategory: string) => {
    try {
      const fetchedProductInfo = await productInfoService.getProductInfo(countryCode, productCategory);
      setProductInfo(fetchedProductInfo);
      return true;
    } catch (error) {
      console.error('Error fetching product info:', error);
      return false;
    }
  };

  return (
    <ProductInfoContext.Provider value={{ productInfo, fetchProductInfo }}>
      {children}
    </ProductInfoContext.Provider>
  );
};

export const useProductInfo = () => {
  const context = useContext(ProductInfoContext);
  if (context === undefined) {
    throw new Error('useProductInfo must be used within a ProductInfoProvider');
  }
  return context;
};
