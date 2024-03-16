export default class ApiError extends Error {
  statusCode: number;
  stack: any;
  additionErrorInfo: any;

  constructor(statusCode: number, message: string, error: Error | any) {
    super(message);
    this.statusCode = statusCode;
    if (error) {
      if (error.name === 'ValidationError') {
        this.stack = error.stack;
        this.additionErrorInfo = error.details || null;
      } else {
        this.stack = error;
        this.additionErrorInfo = null; //validation messages
      }
      //constructErrorInfo(error)
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
