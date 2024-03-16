import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import path from 'path';

class ReportsRouter implements Routes {
  public path = '/reports/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Automatedtest Report Coverage
    this.router.get('/reportCoverage', (req, res) => {
      res.render(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/reportCoverage/index.html'
      );
    });
    this.router.get('/assets/:filename', (req, res) => {
      res.sendFile(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/reportCoverage/assets/' +
          req.params.filename
      );
    });
    this.router.get('/reportCoverage/assets/:filename', (req, res) => {
      res.sendFile(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/reportCoverage/assets/' +
          req.params.filename
      );
    });

    // Automatedtest Code Coverage, html files render folder
    this.router.get('/codeCoverage', (req, res) => {
      //--
      // console.log(
      //   path.join(__dirname, '..','..', 'dist', 'views') + '/codeCoverage/index.html'
      // );

      res.render(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/codeCoverage/index.html'
      );
    });
    this.router.get('/:filename', (req, res) => {
      res.sendFile(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/codeCoverage/' +
          req.params.filename
      );
    });
    this.router.get('/:filename', (req, res) => {
      res.sendFile(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/codeCoverage/' +
          req.params.filename
      );
    });
    this.router.get('/:folder/:filename', (req, res) => {
      res.sendFile(
        path.join(__dirname, '..', '..', 'dist', 'views') +
          '/codeCoverage/' +
          req.params.folder +
          '/' +
          req.params.filename
      );
    });
  }
}

export { ReportsRouter };
