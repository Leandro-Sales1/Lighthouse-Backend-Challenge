import products from "../db/products";
import ICart, { ICartProduct, ICartProducts } from "../models/cart";
import { IProduct } from "../models/products";

export const findAndProcessProducts = (receivedProducts: ICartProducts) => {

  const filteredProducts = products
    .filter(product =>
      receivedProducts.some(receivedProduct => product.SKU === receivedProduct.SKU)
    )
    .map(product => {
      const receivedProduct = receivedProducts.find(receivedProduct => receivedProduct.SKU === product.SKU);
      return updateProductData(product, receivedProduct);
    });

  const finalProducts = applyConditionalDiscount(filteredProducts);

  return finalProducts;
}


export const updateProductData = (product: IProduct, receivedProduct?: Partial<ICartProduct>): ICartProduct => {

  if (!receivedProduct) {
    return { ...product, quantity: 0, finalPrice: 0 };
  }

  const { SKU: sku, quantity = 0, price = product.price } = receivedProduct;
  let finalPrice = 0;

  // Google Home
  if (sku === '120P90' && quantity >= 3) {
    const setsOfThree = Math.floor(quantity / 3);
    const extras = quantity % 3;
    finalPrice = (setsOfThree * 2 + extras) * price;
  } else {
    finalPrice = price * quantity;
  }

  // Alexa Speaker
  if (sku === 'A304SD' && quantity >= 3) {
    finalPrice *= 0.9;
  }

  finalPrice = Number(finalPrice.toFixed(2));

  return {
    ...product,
    quantity,
    finalPrice
  };
};


const applyConditionalDiscount = (cartProducts: ICartProduct[]): ICartProduct[] => {
  return cartProducts.map(product => {
    if (product.SKU === '344222') { // Raspberry Pi
      const macPro = cartProducts.find(cartProduct => cartProduct.SKU === '43N23P'); // MacBook Pro

      if (macPro) {
        if (macPro.quantity >= product.quantity) {
          return { ...product, finalPrice: 0 };
        } else {
          const finalPrice = product.price * (product.quantity - macPro.quantity);
          return { ...product, finalPrice: Number(finalPrice.toFixed(2)) };
        }
      }
    }
    return product;
  });
};


export const prepareFinalCart = (cartProducts: ICartProduct[]): ICart => {
  let cartTotalPrice = cartProducts.reduce((total, product) => total + product.finalPrice, 0);
  cartTotalPrice = Number(cartTotalPrice.toFixed(2));

  return {
    cartTotalPrice,
    products: cartProducts
  }
};

export const hasDuplicateSKUs = (cartProducts: ICartProduct[]): boolean => {
  const skuCount: Record<string, number> = {};

  for (const product of cartProducts) {
    skuCount[product.SKU] = (skuCount[product.SKU] || 0) + 1;

    if (skuCount[product.SKU] > 1) {
      return true;
    }
  }

  return false;
};


