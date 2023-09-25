// DepositDashboardComponent.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors as defaultColors } from '@/assets/Colors';
import { useWallet } from 'react-native-dashboard-component';

type DepositDashboardComponentProps = {
  colors?: typeof defaultColors;
  title?: string;
  subTitle?: string;
  styles?: {
    container?: any;
    card?: any;
    activeCard?: any;
    title?: any;
    balance?: any;
    userInfo?: any;
    part2?: any;
    actionItems?: any;
    actionButton?: any;
    actionText?: any;
    accountList?: any;
    accountCard?: any;
    accountType?: any;
    accountNumber?: any;
    accountBalance?: any;
  };
};

const DepositDashboardComponent: React.FC<DepositDashboardComponentProps> = ({
  colors = defaultColors,
  title,
  subTitle,
  styles: customStyles = {},
}) => {
  const { walletDetails, fetchWalletDetails, paging } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allRecordsLoaded, setAllRecordsLoaded] = useState(false);
  const savingAccount = walletDetails?walletDetails.find((account) => account.accountSubType === 'SavingAccount-i'):null;
  const walletAccounts = walletDetails?walletDetails.filter((account) => account.accountSubType !== 'SavingAccount-i'):[];

  useEffect(() => {
    fetchWalletDetails(paging.pageNumber, paging.pageSize, 'DEPOSIT_WALLET');
  }, []);

  const loadMoreWallets = () => {
    if (!allRecordsLoaded && paging.pageNumber * paging.pageSize < paging.totalRecords) {
      setIsLoading(true);
      fetchWalletDetails(paging.pageNumber + 1, paging.pageSize, 'DEPOSIT_WALLET').then(() => {
        setIsLoading(false);
      });
    } else {
      setAllRecordsLoaded(true);
      setHasMore(false);
    }
  };

  return (
    <View style={[defaultStyles.container, customStyles.container]}>
      {/* Part 1: Total Balance and User Summary (showing only one item) */}
      <View style={[defaultStyles.part1, customStyles.part1]}>
        <View
          style={[
            defaultStyles.card,
            customStyles.card,
            [defaultStyles.activeCard, customStyles.activeCard],
          ]}
        >
          <Text style={[defaultStyles.title, customStyles.title]}>Total Balance</Text>
          <Text style={[defaultStyles.balance, customStyles.balance]}>
            {savingAccount ? `${savingAccount.currencyCode} ${savingAccount.balance.toFixed(2)}` : '$0.00'}
          </Text>
          <Text style={[defaultStyles.userInfo, customStyles.userInfo]}>User Summary: John Doe</Text>
        </View>
      </View>

      {/* Part 2: Action Items and Account List */}
      <View style={[defaultStyles.part2, customStyles.part2]}>
        {/* Part A: Action Items */}
        <View style={[defaultStyles.actionItems, customStyles.actionItems]}>
          <TouchableOpacity
            style={[defaultStyles.actionButton, customStyles.actionButton, { backgroundColor: colors.Pink }]}
          >
            <Icon name="history" size={30} color="white" />
            <Text style={[defaultStyles.actionText, customStyles.actionText, { color: 'white' }]}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.actionButton, customStyles.actionButton, { backgroundColor: colors.Pink  }]}
          >
            <Icon name="file-text-o" size={30} color="white" />
            <Text style={[defaultStyles.actionText, customStyles.actionText, { color: 'white' }]}>e-Statement</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.actionButton, customStyles.actionButton, { backgroundColor: colors.Pink }]}
          >
            <Icon name="plus-circle" size={30} color="white" />
            <Text style={[defaultStyles.actionText, customStyles.actionText, { color: 'white' }]}>New Pot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.actionButton, customStyles.actionButton, { backgroundColor: colors.Pink }]}
          >
            <Icon name="line-chart" size={30} color="white" />
            <Text style={[defaultStyles.actionText, customStyles.actionText, { color: 'white' }]}>Cashflow</Text>
          </TouchableOpacity>
        </View>

        {/* Part B: Main Account */}
        {savingAccount && (
          <View style={defaultStyles.accountCard}>
            <Text style={defaultStyles.accountType}>Saving Account</Text>
            <Text style={defaultStyles.accountNumber}>
              Account Number: {savingAccount.accountNumber}
            </Text>
            {savingAccount.balance !== undefined && savingAccount.balance !== null ? (
              <Text style={defaultStyles.accountBalance}>
                Balance: {savingAccount.currencyCode} {savingAccount.balance.toFixed(2)}
              </Text>
            ) : (
              <Text style={defaultStyles.accountBalance}>Balance: N/A</Text>
            )}
          </View>
        )}


        {/* Part C: Wallet Accounts */}
        <FlatList
          data={walletAccounts}
          keyExtractor={(item) => item.walletId.toString()}
          renderItem={({ item }) => (
            <View style={[defaultStyles.accountCard, customStyles.accountCard]}>
              <Text style={[defaultStyles.accountType, customStyles.accountType]}>
                {item.walletName}
              </Text>
              <Text style={[defaultStyles.accountNumber, customStyles.accountNumber]}>
                Account Number: {item.accountNumber}
              </Text>
              {item.balance !== undefined && (
                <Text style={[defaultStyles.accountBalance, customStyles.accountBalance]}>
                  Balance: {item.currencyCode} {item.balance.toFixed(2)}
                </Text>
              )}
            </View>
          )}
          onEndReached={loadMoreWallets}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() =>
            isLoading ? (
              <ActivityIndicator
                size="small"
                color={
                  customStyles.accountType?.color ||
                  colors?.Pink ||
                  defaultColors.GraySubtitle
                }
              />
            ) : null
          }
        />
      </View>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.White,
  },
  part1: {
    paddingTop: 15,
  },
  card: {
    backgroundColor: defaultColors.pink,
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    minHeight: 100,
    marginBottom: 10,
  },
  activeCard: {
    borderColor: defaultColors.blue,
    borderWidth: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColors.GraySubtitle,
  },
  balance: {
    fontSize: 24,
    marginTop: 8,
    color: defaultColors.GraySubtitle,
  },
  userInfo: {
    fontSize: 16,
    marginTop: 8,
    color: defaultColors.OffWhite,
  },
  part2: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: defaultColors.lightGray,
    paddingTop: 24,
    marginTop: -12,
    paddingHorizontal: 15,
    flex: 1,
  },
  actionItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    marginTop: 8,
  },
  accountCard: {
    backgroundColor: defaultColors.White,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderColor: defaultColors.gray,
    borderWidth: 1,
  },
  accountType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: defaultColors.GraySubtitle,
  },
  accountNumber: {
    fontSize: 14,
    color: defaultColors.OffWhite,
  },
  accountBalance: {
    fontSize: 18,
    marginTop: 8,
    color: defaultColors.GraySubtitle,
  },
});

export default DepositDashboardComponent;
