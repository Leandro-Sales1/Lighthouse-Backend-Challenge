import { Request, Response } from 'express';
import { prepareFinalCart, findAndProcessProducts, hasDuplicateSKUs } from '../utils/cart';
import { ICartProducts } from '../models/cart';

class CheckOutController {
  static processCart(req: Request, res: Response) {
    const { cart }: { cart: ICartProducts } = req.body;

    if (!Array.isArray(cart) || cart.length === 0) {
      res.status(400).json({ message: 'Invalid cart, must be a non-empty array.' });
      return;
    }

    if (hasDuplicateSKUs(cart)) {
      res.status(400).json({ message: 'Invalid cart, duplicate SKUs are not allowed.' });
      return;
    }

    const allProductsValid = cart.every(product => product.SKU && product.quantity && product.quantity > 0);

    if (!allProductsValid) {
      res.status(400).json({ message: 'Invalid cart, all the products must have a valid SKU and quantity > 0.' });
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
