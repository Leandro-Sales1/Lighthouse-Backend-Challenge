import { Request, Response } from 'express';
import { findAndProcessProducts } from '../utils/cart';
import ICart from '../models/cart';



class CheckOutController {

  static saveCart(req: Request, res: Response) {
    const { cart }: { cart: ICart } = req.body;
    const cartProducts = findAndProcessProducts(cart);

    if (!cartProducts || cartProducts.length === 0) {
      res.status(404).json({ message: 'No products found' })
      return
    }

    const allProductsValid = cartProducts.every(product => product.SKU && product.quantity > 0);

    if (!allProductsValid) {
      res.status(400).json({ message: 'Invalid cart, all the products needs to have SKU and quantity.' })
    }
    res.status(200).json(cartProducts)
  }
}

export default CheckOutController;