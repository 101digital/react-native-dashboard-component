import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { useUser, useWallet } from 'react-native-dashboard-component';
import { colors as defaultColors } from '../../assets/colors';
import { DepositDashboardComponent, FinanceDashboardComponent } from 'react-native-dashboard-component';

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
  showDeposit?:boolean;
  showFinance?:boolean;
};

const AccountSummaryComponent: React.FC<AccountSummaryComponentProps> = ({
  colors,
  title,
  subTitle,
  styles: customStyles = {},
  showDeposit,
  showFinance
}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>

    {showDeposit && <DepositDashboardComponent
      isSlider={true}
      colors={colors}
      styles={customStyles}
      title="Your Title"
      subTitle="Your Subtitle"
    />}

    {showFinance && <FinanceDashboardComponent
        isHorizontal={false}
        colors={colors}
        title="Your Title"
        subTitle="Your Subtitle"
      />}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
