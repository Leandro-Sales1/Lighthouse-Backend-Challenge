import { Request, Response } from 'express';
import products from '../db/products';



class ProductsController {

  static listAllProducts(req: Request, res: Response) {
    if (!products || products.length === 0) {
      res.status(404).json({ message: 'No products found' })
      return
    }
    res.status(200).json(products)
  }
}

export default ProductsController;