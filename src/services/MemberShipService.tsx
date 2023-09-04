type MemberShipClient = any; // Replace with the appropriate AxiosInstance type

export class MemberShipService {
    private static _instance: MemberShipService = new MemberShipService();
    private _memberShipClient?: MemberShipClient;

    private constructor() {
        if (MemberShipService._instance) {
            throw new Error(
                'Error: Instantiation failed: Use MemberShipService.getInstance() instead of new.'
            );
        }
        MemberShipService._instance = this;
    }

    public static instance(): MemberShipService {
        return MemberShipService._instance;
    }

    public initClients = (clients: { memberShipClient: MemberShipClient }) => {
        this._memberShipClient = clients.memberShipClient;
    }

    getProfile = async () => {
        try {
            if (!this._memberShipClient) {
                throw new Error('Member Ship Client is not registered');
            }

            const response = await this._memberShipClient.get(`/users/me`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to get user profile: ' + error.message);
        }
    }

    updateProfile = async (userId: string, body: any) => {
        try {
            if (!this._memberShipClient) {
                throw new Error('MemberShip Client is not registered');
            }

            const response = await this._memberShipClient.patch(
                `/users/${userId}`,
                body,
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to update user profile: ' + error.message);
        }
    }
}
