import { findAndProcessProducts, updateProductData, prepareFinalCart, hasDuplicateSKUs } from './cart';
import products from "../db/products";
import { ICartProduct, ICartProducts } from "../models/cart";


jest.mock('../db/products', () => [
  { SKU: '120P90', name: 'Google Home', price: 49.99 },
  { SKU: '43N23P', name: 'Mac Pro', price: 5399.99 },
  { SKU: 'A304SD', name: 'Alexa Speaker', price: 109.50 },
  { SKU: '344222', name: 'Raspberry Pi', price: 30.00 }
]);

describe("Cart Utils", () => {

  describe("findAndProcessProducts", () => {
    it("should return processed products with correct finalPrice for Google Home", () => {
      const cartProducts: ICartProducts = [
        { SKU: '120P90', quantity: 3, price: 49.99, finalPrice: 0, name: 'Google Home' },
      ];

      const processedProducts = findAndProcessProducts(cartProducts);

      expect(processedProducts[0].finalPrice).toBe(99.98);
    });

    it("should apply discount for Alexa Speaker when quantity is >= 3", () => {
      const cartProducts: ICartProducts = [
        { SKU: 'A304SD', quantity: 3, price: 109.50, finalPrice: 0, name: 'Alexa Speaker' },
      ];

      const processedProducts = findAndProcessProducts(cartProducts);

      expect(processedProducts[0].finalPrice).toBe(295.65);
    });

    describe("updateProductData", () => {
      it("should apply 10% discount for Alexa Speaker when quantity is >= 3", () => {
        const cartProduct: ICartProduct = { SKU: 'A304SD', quantity: 3, price: 109.50, finalPrice: 0, name: 'Alexa Speaker' };
        const updatedProduct = updateProductData(products.find(p => p.SKU === 'A304SD')!, cartProduct);

        expect(updatedProduct.finalPrice).toBe(295.65);
      });

      it("should not apply 10% discount for Alexa Speaker if quantity is < 3", () => {
        const cartProduct: ICartProduct = { SKU: 'A304SD', quantity: 2, price: 109.50, finalPrice: 0, name: 'Alexa Speaker' };
        const updatedProduct = updateProductData(products.find(p => p.SKU === 'A304SD')!, cartProduct);

        expect(updatedProduct.finalPrice).toBe(219);
      });
    });

    describe("findAndProcessProducts", () => {
      it("should apply Raspberry Pi discount if Mac Pro is in cart", () => {
        const cartProducts: ICartProducts = [
          { SKU: '344222', quantity: 2, price: 30.00, finalPrice: 0, name: 'Raspberry Pi' },
          { SKU: '43N23P', quantity: 1, price: 5399.99, finalPrice: 0, name: 'Mac Pro' },
        ];

        const processedProducts = findAndProcessProducts(cartProducts);

        expect(processedProducts.find(p => p.SKU === '344222')?.finalPrice).toBe(30);
      });

      it("should not apply Raspberry Pi discount if Mac Pro is not in cart", () => {
        const cartProducts: ICartProducts = [
          { SKU: '344222', quantity: 2, price: 30.00, finalPrice: 0, name: 'Raspberry Pi' },
        ];

        const processedProducts = findAndProcessProducts(cartProducts);

        expect(processedProducts.find(p => p.SKU === '344222')?.finalPrice).toBe(60);
      });
    });

    it("should return empty list if no products in cart match", () => {
      const cartProducts: ICartProducts = [
        { SKU: 'XYZ123', quantity: 2, price: 10.00, finalPrice: 0, name: 'Non-existent SKU' },
      ];

      const processedProducts = findAndProcessProducts(cartProducts);

      expect(processedProducts).toHaveLength(0);
    });
  });

  describe("updateProductData", () => {
    it("should apply 10% discount for Alexa Speaker when quantity is >= 3", () => {
      const cartProduct: ICartProduct = { SKU: 'A304SD', quantity: 3, price: 109.50, finalPrice: 0, name: 'Alexa Speaker' };
      const updatedProduct = updateProductData(products.find(p => p.SKU === 'A304SD')!, cartProduct);

      expect(updatedProduct.finalPrice).toBe(295.65);
    });

    it("should not apply 10% discount for Alexa Speaker if quantity is < 3", () => {
      const cartProduct: ICartProduct = { SKU: 'A304SD', quantity: 2, price: 109.50, finalPrice: 0, name: 'Alexa Speaker' };
      const updatedProduct = updateProductData(products.find(p => p.SKU === 'A304SD')!, cartProduct);

      expect(updatedProduct.finalPrice).toBe(219);
    });

    it("should use default quantity as 0 when not provided", () => {
      const cartProduct: Partial<ICartProduct> = { SKU: '120P90', price: 49.99, finalPrice: 0, name: 'Google Home' };
      const updatedProduct = updateProductData(products[0], cartProduct);

      expect(updatedProduct.quantity).toBe(0);
      expect(updatedProduct.finalPrice).toBe(0);
    });

    it("should use product price if price is not provided in receivedProduct", () => {
      const cartProduct: Partial<ICartProduct> = { SKU: '120P90', quantity: 2, finalPrice: 0, name: 'Google Home' };
      const updatedProduct = updateProductData(products[0], cartProduct);

      expect(updatedProduct.price).toBe(49.99);
      expect(updatedProduct.finalPrice).toBe(99.98);
    });

    it("should correctly apply discount for Google Home when quantity is >= 3", () => {
      const cartProduct: ICartProduct = { SKU: '120P90', quantity: 3, price: 49.99, finalPrice: 0, name: 'Google Home' };
      const updatedProduct = updateProductData(products[0], cartProduct);

      expect(updatedProduct.finalPrice).toBe(99.98);
    });

    it("should apply finalPrice correctly when quantity is greater than 3 for Google Home", () => {
      const cartProduct: ICartProduct = { SKU: '120P90', quantity: 6, price: 49.99, finalPrice: 0, name: 'Google Home' };
      const updatedProduct = updateProductData(products[0], cartProduct);

      expect(updatedProduct.finalPrice).toBe(199.96);
    });

  });

  describe("prepareFinalCart", () => {
    it("should calculate the total price of the cart correctly", () => {
      const cartProducts: ICartProduct[] = [
        { SKU: '120P90', quantity: 3, finalPrice: 99.98, name: 'Google Home', price: 49.99 },
        { SKU: 'A304SD', quantity: 3, finalPrice: 295.65, name: 'Alexa Speaker', price: 109.50 },
      ];

      const finalCart = prepareFinalCart(cartProducts);

      expect(finalCart.cartTotalPrice).toBe(395.63);
    });
  });

  describe("hasDuplicateSKUs", () => {
    it("should return true if there are duplicate SKUs", () => {
      const cartProducts: ICartProduct[] = [
        { SKU: '120P90', quantity: 1, finalPrice: 49.99, name: 'Google Home', price: 49.99 },
        { SKU: '120P90', quantity: 2, finalPrice: 99.98, name: 'Google Home', price: 49.99 },
      ];

      expect(hasDuplicateSKUs(cartProducts)).toBe(true);
    });

    it("should return false if there are no duplicate SKUs", () => {
      const cartProducts: ICartProduct[] = [
        { SKU: '120P90', quantity: 1, finalPrice: 49.99, name: 'Google Home', price: 49.99 },
        { SKU: 'A304SD', quantity: 2, finalPrice: 219.00, name: 'Alexa Speaker', price: 109.50 },
      ];

      expect(hasDuplicateSKUs(cartProducts)).toBe(false);
    });
  });
});
