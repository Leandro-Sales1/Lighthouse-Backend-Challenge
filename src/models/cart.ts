import { IProduct } from "./products";

export interface ICartProduct extends IProduct {
  quantity: number;
  finalPrice: number;
}

export interface ICartProducts extends Array<ICartProduct> { }

interface ICart {
  cartTotalPrice: number;
  products: ICartProduct[];
}

export default ICart;
