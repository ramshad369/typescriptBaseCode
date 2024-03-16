import { QueryOptions } from 'winston';
import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse
} from '../../core/response-handler';
import Logger from '../../core/logger';

export const getRecentLogs = async (req: Request | any, res: Response) => {
  try {
    const count = req.query.count ? parseInt(req.query.count) : 10;
    let sDate = new Date(new Date().valueOf() - 24 * 60 * 60 * 1000);
    let eDate = new Date();

    if (req.query.startDate) {
      sDate = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      eDate = new Date(req.query.endDate);
    }

    const logs = await new Promise((resolve, reject) => {
      const options: QueryOptions = {
        from: sDate,
        until: eDate,
        limit: count,
        start: 0,
        order: 'desc',
        fields: undefined
        // fields: ['message']
      };
      Logger.query(options, function (err: Error, results: unknown) {
        if (err) {
          Logger.error(err);
          reject(err);
        }
        resolve(results);
      });
    });

    return sendSuccessResponse(req, res, logs);
  } catch (e) {
    return sendErrorResponse(req, res, 500, 'Something went wrong', e);
  }
};
