import env from '@/env';
type WalletClient = any; // Replace with the appropriate AxiosInstance type

export class WalletService {
    private static _instance: WalletService = new WalletService();
    private _walletClient?: WalletClient;

    private constructor() {
        if (WalletService._instance) {
            throw new Error(
                'Error: Instantiation failed: Use WalletService.getInstance() instead of new.'
            );
        }
        WalletService._instance = this;
    }

    public static instance(): WalletService {
        return WalletService._instance;
    }

    public initClients = (clients: { walletClient: WalletClient }) => {
        this._walletClient = clients.walletClient;
    }


    getWallets = async (page: number, pageSize: number, type?: string) => {
      try {
        if (!this._walletClient) {
          throw new Error('Wallet Client is not registered');
        }

        let url = `wallets?bankId=${env.api.bankId}&page=${page}&pageSize=${pageSize}`;

        if (type) {
          url += `&type=${type}`;
        }

        const response = await this._walletClient.get(url);
        return response.data;
      } catch (error) {
        throw new Error('Failed to get wallet list: ' + error);
      }
    }


}
