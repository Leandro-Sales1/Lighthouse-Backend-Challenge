import express from 'express';
import ProductsController from '../controllers/productsController';
import CheckOutController from '../controllers/checkOutController';


const checkOutRoutes = express.Router()

checkOutRoutes.post('/cart', CheckOutController.processCart)



export default checkOutRoutes;

