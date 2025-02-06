import express from 'express';
import ProductsController from '../controllers/productsController';


const productsRoutes = express.Router()

productsRoutes.get("/products", ProductsController.listAllProducts);



export default productsRoutes;

