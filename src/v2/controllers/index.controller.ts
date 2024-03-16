import { Request, Response } from 'express';
import {
  sendSuccessResponse,
  sendErrorResponse
} from '../../core/response-handler';
import Logger from '../../core/logger';
import ApiError from '../../core/api-error';

export const index = async (req: Request, res: Response) => {
  try {
    Logger.info('OK');
    return sendSuccessResponse(req, res, 'Welcome to V2 Apis');
  } catch (err) {
    return sendErrorResponse(req, res, 500, 'Something went wrong', err);
  }
};

export const error = async (req: Request, res: Response) => {
  try {
    throw new ApiError(400, 'Error thrown successful V2', new Error());
  } catch (err) {
    return sendErrorResponse(req, res, 500, 'Something went wrong', err);
  }
};
