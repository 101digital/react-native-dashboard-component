import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useUser, useWallet } from 'react-native-auth-component';
import { colors as defaultColors } from '../../assets/colors';

type AccountSummaryComponentProps = {
  colors?: typeof defaultColors; // Define colors prop type
  title?: string;
  subTitle?: string;
  styles?: {
    container?: StyleProp<ViewStyle>;
    title?: StyleProp<TextStyle>;
    userInfo?: StyleProp<TextStyle>;
    walletListTitle?: StyleProp<TextStyle>;
    walletItem?: StyleProp<ViewStyle>;
    accountType?: StyleProp<TextStyle>;
    noMoreText?: StyleProp<TextStyle>;
    label?: StyleProp<TextStyle>;
  };
};

const AccountSummaryComponent: React.FC<AccountSummaryComponentProps> = ({
  colors,
  title,
  subTitle,
  styles: customStyles = {},
}) => {
  const { userDetails } = useUser();
  const { walletDetails, fetchWalletDetails, paging } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allRecordsLoaded, setAllRecordsLoaded] = useState(false);

  useEffect(() => {
    if (!walletDetails) {
      fetchWalletDetails(paging.pageNumber, paging.pageSize);
    }
  }, []);

  const loadMoreWallets = () => {
    if (!allRecordsLoaded && paging.pageNumber * paging.pageSize < paging.totalRecords) {
      setIsLoading(true);
      fetchWalletDetails(paging.pageNumber + 1, paging.pageSize).then(() => {
        setIsLoading(false);
      });
    } else {
      setAllRecordsLoaded(true);
      setHasMore(false);
    }
  };

  if (!userDetails || !userDetails.data) {
    return (
      <View
        style={[
          styles.container,
          customStyles.container,
          { backgroundColor: customStyles.container?.backgroundColor || colors?.background || defaultColors.background },
        ]}
      >
        <Text
          style={[
            styles.title,
            customStyles.title,
            { color: customStyles.title?.color || colors?.primary || defaultColors.primaryText },
          ]}
        >
          Account Summary
        </Text>
        <Text>No user details available</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        customStyles.container,
        { backgroundColor: customStyles.container?.backgroundColor || colors?.background || defaultColors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          customStyles.title,
          { color: customStyles.title?.color || colors?.primary || defaultColors.primaryText },
        ]}
      >
        {title ? title : `Account Summary`}
      </Text>
      <Text
        style={[
          styles.userInfo,
          customStyles.userInfo,
          { color: customStyles.userInfo?.color || colors?.text || defaultColors.text },
        ]}
      >
        {`Logged-in User Name: ${userDetails.data.firstName} ${userDetails.data.lastName}`}
      </Text>

      <Text
        style={[
          styles.walletListTitle,
          customStyles.walletListTitle,
          { color: customStyles.walletListTitle?.color || colors?.primary || defaultColors.primaryText },
        ]}
      >
        {subTitle ? subTitle : `Account List`}
      </Text>
      {
        <FlatList
          data={walletDetails}
          keyExtractor={(item) => item.walletId.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.walletItem,
                customStyles.walletItem,
                { backgroundColor: customStyles.walletItem?.backgroundColor || colors?.secondary || defaultColors.grayBackground },
              ]}
            >
              <Text
                style={[
                  styles.accountType,
                  customStyles.accountType,
                  { color: customStyles.accountType?.color || colors?.accent || defaultColors.accent },
                ]}
              >
                {item.accountType}
              </Text>
              <Text style={styles.label}>Name: {item.walletName}</Text>
              <Text style={styles.label}>Balance: {item.balance}</Text>
              <Text style={styles.label}>Account Number: {item.accountNumber}</Text>
            </View>
          )}
          onEndReached={loadMoreWallets}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            isLoading ? <ActivityIndicator size="small" color={customStyles.accountType?.color || colors?.primary || defaultColors.primaryText} /> : null
          }
        />
      }
      {hasMore || isLoading ? null : (
        <Text
          style={[
            styles.noMoreText,
            customStyles.noMoreText,
            { color: customStyles.noMoreText?.color || colors?.text || defaultColors.text },
          ]}
        >
          No more wallets to display
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 20,
  },
  walletListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  walletItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  accountType: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noMoreText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    color: 'white',
  },
});

export default AccountSummaryComponent;
