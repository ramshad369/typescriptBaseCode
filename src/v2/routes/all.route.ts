import { Router } from 'express';
import { Routes } from '../../interfaces/routes.interface';
import * as IndexController from '../controllers/index.controller';
import LoggerRoute from './logger.route';

class V2AllRouter implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //welcome api
    this.router.get(`${this.path}`, IndexController.index);
    this.router.get(`${this.path}error`, IndexController.error);

    //models apis
    this.router.use(`${this.path}`, new LoggerRoute().router);
  }
}

export { V2AllRouter };
