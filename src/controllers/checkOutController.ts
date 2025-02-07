import { Request, Response } from 'express';
import { prepareFinalCart, findAndProcessProducts, hasDuplicateSKUs } from '../utils/cart';
import ICart, { ICartProducts } from '../models/cart';



class CheckOutController {

  static processCart(req: Request, res: Response) {
    const { cart }: { cart: ICartProducts } = req.body;

    if (hasDuplicateSKUs(cart)) {
      res.status(400).json({ message: 'Invalid cart, all the products needs to have only one object.' });
      return;
    }

    const allProductsValid = cart.every(product => product.SKU && product.quantity > 0);

    if (!allProductsValid) {
      res.status(400).json({ message: 'Invalid cart, all the products needs to have SKU and quantity.' });
      return;
    }

    const cartProducts = findAndProcessProducts(cart);

    if (!cartProducts || cartProducts.length === 0) {
      res.status(404).json({ message: 'Ops... No products found, check your SKU. ' });
      return;
    }

    const finalCart = prepareFinalCart(cartProducts);

    res.status(200).json(finalCart);
  }
}

export default CheckOutController;