import { Request, Response } from 'express';
import ApiError from './api-error';
import Logger from './logger';

/**
 * Success response sender
 * @param {Request} req request object.
 * @param {Response} res response object.
 * @param {any} data returning data.
 * @return {any} returns data with success status.
 */
export async function sendSuccessResponse(
  req: Request,
  res: Response,
  data: any,
  status = 200
): Promise<any> {
  res.status(status);
  // save to logs
  contextMiddleware(req, res, '');

  return res.send(data);
}

/**
 * Failure response sender
 * @param {Request} req request object.
 * @param {Response} res response object.
 * @param {number} statusCode returning data error status code.
 * @param {string} errMsg response error message.
 * @param {any} error specific error object.
 * @return {any} returns data with success status.
 */
export async function sendErrorResponse(
  req: Request,
  res: Response,
  statusCode: number,
  errMsg: any,
  error: any
): Promise<any> {
  res.status(statusCode);
  const err = error;

  // save to logs
  contextMiddleware(req, res, err);

  // save activitis
  if (error instanceof ApiError) {
    return res.status(error.statusCode).send({
      success: false,
      message: error.message || 'Failed to process this request',
      data: null,
      error: error.additionErrorInfo,
      errorMessage: error.message,
      errorStack: error.stack
    });
  }
  if (error instanceof Error) {
    return res.send({
      success: false,
      message: errMsg,
      data: null,
      error: null,
      errorMessage: error.message,
      errorStack: error.stack
    });
  } else {
    return res.send({
      success: false,
      message: errMsg,
      data: null,
      error: null
    });
  }
}

const contextMiddleware = (
  request: Request,
  response: Response,
  error: any
) => {
  // --const {rawHeaders, httpVersion, method, socket, url} = request;
  const { method, socket, url } = request;
  const { statusCode } = response;
  const { remoteAddress, remoteFamily } = socket;

  if (statusCode < 299) {
    Logger.info(
      JSON.stringify({
        // timestamp: new Date().toLocaleString('en-GB'),
        // rawHeaders,
        // httpVersion,
        method,
        url,
        statusCode,
        remoteAddress,
        remoteFamily
      })
    );
  } else {
    const errorMessage = error ? error.message : null;
    const errorStack = error ? error.stack : null;
    Logger.error(
      JSON.stringify({
        // timestamp: new Date().toLocaleString('en-GB'),
        // rawHeaders,
        // httpVersion,
        method,
        url,
        statusCode,
        errorMessage,
        errorStack,
        remoteAddress,
        remoteFamily
      })
    );
  }
};
