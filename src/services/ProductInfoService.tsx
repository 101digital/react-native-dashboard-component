type ProductInfoClient = any; // Replace with the appropriate ProductInfoClient type

export class ProductInfoService {
  private static _instance: ProductInfoService = new ProductInfoService();
  private _productInfoClient?: ProductInfoClient;

  private constructor() {
    if (ProductInfoService._instance) {
      throw new Error(
        'Error: Instantiation failed: Use ProductInfoService.getInstance() instead of new.'
      );
    }
    ProductInfoService._instance = this;
  }

  public static instance(): ProductInfoService {
    return ProductInfoService._instance;
  }

  public initClients = (clients: { productInfoClient: ProductInfoClient }) => {
    this._productInfoClient = clients.productInfoClient;
  };

  // Implement a method to fetch product information
  public getProductInfo = async (countryCode: string, productCategory: string) => {
    try {
      if (!this._productInfoClient) {
        throw new Error('Product Info Client is not registered');
      }

      const url = `products?countryCode=${countryCode}&productCategory=${productCategory}`;

      // Add headers and perform the GET request
      const response = await this._productInfoClient.get(url);

      return response.data;
    } catch (error) {
      throw new Error('Failed to get product information: ' + error);
    }
  };
}
