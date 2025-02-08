import { Request, Response } from 'express';
import products from '../db/products';



class ProductsController {

  static listAllProducts(req: Request, res: Response) {
    res.status(200).json(products);
  }
}

export default ProductsController;