//FinanceDashboard
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useProductInfo } from 'react-native-dashboard-component';
import { colors as defaultColors } from '@/assets/Colors';
import { Button } from 'react-native-theme-component';
type FinanceDashboardComponentProps = {
  colors?: typeof defaultColors;
  styles?: {};
  isHorizontal?: boolean; // Add isHorizontal prop
};

const FinanceDashboardComponent: React.FC<FinanceDashboardComponentProps> = ({
  colors = defaultColors,
  styles: customStyles = {},
  isHorizontal = false, // Default to vertical
}) => {
  const { productInfo, fetchProductInfo } = useProductInfo(); // Use the product info context

  useEffect(() => {
    // Call fetchProductInfo when the component mounts
    fetchProductInfo('MYS', 'FINANCING');
  }, []);

  const handleCreateButtonClick = (product: any) => {
    // Handle the create button click for the selected product
    // You can perform actions or navigate to another screen here
    console.log('Create button clicked for product:', product);
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={[
          styles.card,
          {
            width: windowWidth * 0.9, // Set card width to 90% of screen width
            marginLeft: index === 0 ? 16 : 0, // Add left margin to the first card
          },
          index === activeCardIndex ? styles.activeCard : {},
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.balance}>{item.balance}</Text>
        <Text style={styles.userInfo}>{item.userInfo}</Text>
      </View>
    );
  };

  return (
    <View style={[defaultStyles.container, customStyles.container]}>
      <Text style={[defaultStyles.title, customStyles.title]}>Finance Dashboard</Text>
      {/* Product list */}
      {productInfo ? (
        <FlatList
          data={productInfo.data}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <View style={[defaultStyles.productInfoContainer, customStyles.productInfoContainer]}>
              <Text style={[defaultStyles.productInfoText, customStyles.productInfoText]}>
                {item.detail.productCategory}
              </Text>
              <Text style={[defaultStyles.productInfoText, customStyles.productInfoText]}>
                {item.detail.description}
              </Text>
              <Button
                label='Create'
                onPress={() => handleCreateButtonClick(item)}
                variant= 'primary'
                style={{
                  primaryContainerStyle: {
                    flex: 1,
                  }
                }}
              />
            </View>
          )}
          horizontal={isHorizontal} // Set horizontal prop based on the isHorizontal prop
          style={[
            { backgroundColor: isHorizontal ? 'lightblue' : 'transparent' },
            customStyles.productList,
            isHorizontal && { flex: 1 }, // Each item takes full width when horizontal
          ]}
        />
      ) : (
        <ActivityIndicator size="large" color={colors.primary} />
      )}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: defaultColors.OffWhite,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productInfoContainer: {
    marginTop: 16,
    paddingBottom: 16,
    backgroundColor:defaultColors.GrayScale,
    padding:15,
    borderRadius:10
  },
  productInfoText: {
    fontSize: 16,
    marginBottom: 8,
    color:defaultColors.White,
  },
  createButton: {
    backgroundColor: defaultColors.Pink,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: defaultColors.White,
    fontWeight: 'bold',
  },
});

export default FinanceDashboardComponent;
