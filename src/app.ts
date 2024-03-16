import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compression from 'compression';
import morganMiddleware from './core/morgan';
import express, { NextFunction, Request, Response } from 'express';
import Logger from './core/logger';
import { NODE_ENV, PORT, ORIGIN, CREDENTIALS } from './config';
import { dbConnection } from './databases';
import { V2AllRouter } from './v2/routes/all.route';
import { SwaggerRouter } from './helpers/swagger-routes.helper';
import { ReportsRouter } from './helpers/reports-routes.helper';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

class App {
  private app: express.Application;
  private env: string;
  private port: string | number;

  constructor() {
    this.app = express();
    this.env = NODE_ENV;
    this.port = PORT;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public listen(server: HttpServer | HttpsServer) {
    server.listen(this.port, () => {
      Logger.info(`======= ENV: ${this.env} =======`);
      Logger.info(`🚀 API service listening on port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    dbConnection();
  }

  private initializeMiddlewares() {
    // html file rendering
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../dist/views'));
    this.app.engine('html', require('ejs').renderFile);

    this.app.use(morganMiddleware);
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(function (req: Request, res: Response, next: NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, cache-control, authorization'
      );
      // --res.setHeader('Access-Control-Allow-Credentials', true);

      res.setHeader('Cache-control', 'no-store');
      next();
    });
  }

  private initializeRoutes() {
    this.app.get('/', (req: Request, res: Response) => {
      return res.send('Welcome to department service.');
    });

    this.app.use('/api/v2', new V2AllRouter().router);

    //swagger
    this.app.use('/api/swagger', new SwaggerRouter().router);

    // test case reports
    // keep this one always last
    // otherwise it will affect main Apis
    this.app.use('/api', new ReportsRouter().router);
  }
}

export default App;

//Error Handlers
process.on('unhandledRejection', err => {
  Logger.error(err);
});

process.on('uncaughtException', err => {
  Logger.error(err);
  Logger.error(err.stack);
});

process.on('beforeExit', code => {
  // Can make asynchronous calls
  Logger.info(`Process will exit with code: ${code}`);
});

process.on('exit', code => {
  // Only synchronous calls
  Logger.info(`Process exited with code: ${code}`);
});
