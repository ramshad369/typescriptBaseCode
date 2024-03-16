import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Routes } from '../interfaces/routes.interface';
import { PORT } from '../config';
class SwaggerRouter implements Routes {
  public path = '/';
  public router = Router();
  // Swagger definition
  public swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Rest API Docs',
      description: 'Api docs of All versions',
      contact: {
        name: 'Fortunesoft IT Innovations LTD',
        url: 'https://www.fortunesoftit.com/',
        email: 'support@fortunesoftit.com'
      },
      version: '1.0.1'
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/`,
        description: 'Local Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Requests should Pass an Bearer token in header'
        }
      }
    }
  };

  // options for the swagger docs
  public options = {
    // import swaggerDefinitions
    swaggerDefinition: this.swaggerDefinition,
    // path to the API docs of All versions
    apis: ['./src/**/swagger/**/*.yaml']
  };
  // initialize swagger-jsdoc
  public swaggerSpec = swaggerJSDoc(this.options);

  public options1 = {
    swaggerOptions: {
      docExpansion: 'none'
    }
  };

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(
      this.path,
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerSpec, this.options1)
    );
  }
}

export { SwaggerRouter };
