import { Request, NextFunction, Response } from 'express';
import Joi from 'joi';
import ApiError from '../core/api-error';
import { sendErrorResponse } from '../core/response-handler';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config';

/**
 * Validate request payload
 * @param {Request} req request object.
 * @param {any} reqBody custom body.
 * @param {Joi.Schema} schema schema body.
 * @return {any} next() will call respective funnctions
 */
export async function requestValidator(
  req: Request,
  reqBody: any,
  schema: Joi.Schema
): Promise<any> {
  const reqData = reqBody || req.body;
  return schema
    .validateAsync(reqData)
    .then((data: any) => {
      if (reqBody) {
        // dont update striped data to req body here
      } else {
        req.body = data;
      }
      return true;
    })
    .catch((err: Error) => {
      throw new ApiError(422, 'Unprocessable entity', err.stack);
    });
}

/**
 * Method to verify the incoming jwt token in request is valid
 * @param req Express request
 * @param res Express response
 * @param next Next Function
 * @returns
 */
export const verifyToken = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  // const token = true;
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.json({ status: '401', msg: 'Unauthorized' });
  }
  const TokenArray = headerToken.split(' ');
  const jwtData = await jwt.verify(TokenArray[1], SECRET_KEY as jwt.Secret);
  if (await isJwtData(jwtData)) {
    req['jwtData'] = jwtData;
    next();
  } else {
    return sendErrorResponse(
      req,
      res,
      401,
      `JWT don't have required value`,
      ''
    );
  }
};

const isJwtData = async (obj: any): Promise<boolean> => {
  return typeof obj.companyId === 'string' && obj.id.trim() != '';
};
