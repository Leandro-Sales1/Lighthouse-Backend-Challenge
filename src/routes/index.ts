import express, { Express } from 'express';
import cors from 'cors';
import checkOutRoutes from './checkOutRoutes';
import productsRoutes from './productsRoutes';


const routes = (app: Express) => {

  app.use(cors());
  app.use(express.json());
  app.use(productsRoutes);
  app.use(checkOutRoutes);
}

export default routes;