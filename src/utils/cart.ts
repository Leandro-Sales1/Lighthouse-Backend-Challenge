import products from "../db/products";
import ICart, { ICartProduct } from "../models/cart";
import { IProduct } from "../models/products";

export const findAndProcessProducts = (receivedProducts: ICart) => {

  const filteredProducts = products
    .filter(product =>
      receivedProducts.some(receivedProduct => product.SKU === receivedProduct.SKU)
    )
    .map(product => {
      const receivedProduct = receivedProducts.find(p => p.SKU === product.SKU);
      return updateProductData(product, receivedProduct);
    });

  return filteredProducts;
}


export const updateProductData = (product: IProduct, receivedProduct?: ICartProduct): ICartProduct => {
  const sku = receivedProduct?.SKU
  const quantity = receivedProduct?.quantity ?? 0;
  const price = receivedProduct?.price ?? product.price;
  let finalPrice = 0;

  // Google Home
  if (sku === '120P90' && quantity >= 3) {

    const setsOfThree = Math.floor(quantity / 3);
    const extras = quantity % 3;
    finalPrice = (setsOfThree * 2 + extras) * price

  } else {
    finalPrice = price * quantity
  }

  // Alexa Speaker
  if (sku === 'A304SD' && quantity >= 3) {
    finalPrice = price * quantity
    finalPrice *= 0.9;

  } else {
    finalPrice = price * quantity
  }

  finalPrice = Number(finalPrice.toFixed(2));

  return {
    ...product,
    quantity,
    finalPrice
  };
};