import { IProduct } from "./products";

export interface ICartProduct extends IProduct {
  quantity: number;
  finalPrice: number;
}

interface ICart extends Array<ICartProduct> { }

export default ICart;
