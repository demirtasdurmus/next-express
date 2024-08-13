import httpStatus from "http-status";

export class BaseError extends Error {
  name: string;
  statusCode: number;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(httpStatus["400_NAME"], message, httpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super(httpStatus["401_NAME"], message, httpStatus.UNAUTHORIZED);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(httpStatus["404_NAME"], message, httpStatus.NOT_FOUND);
  }
}
