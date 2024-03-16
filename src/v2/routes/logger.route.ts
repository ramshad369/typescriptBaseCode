import { Router } from 'express';
import * as LoggerController from '../controllers/logger.controller';
import { Routes } from '../../interfaces/routes.interface';

class LoggerRoute implements Routes {
  public path = '/logger';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //get recent logs
    this.router.get(
      `${this.path}/getRecentLogs`,
      LoggerController.getRecentLogs
    );
  }
}

export default LoggerRoute;
