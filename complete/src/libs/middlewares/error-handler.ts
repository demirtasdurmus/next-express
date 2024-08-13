import httpStatus from "http-status";
import { IMiddlewareHandler } from "..";
import { BaseError } from "../errors.ts";

export const errorHandler: IMiddlewareHandler = (req, res, next) => {
  return next().catch((err: unknown) => {
    let serializedError: BaseError;
    if (err instanceof BaseError) {
      serializedError = err;
    } else {
      serializedError = new BaseError(
        (err as any).name || httpStatus["500_NAME"],
        (err as any).message || httpStatus["500_MESSAGE"],
        (err as any).statusCode || httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (serializedError.statusCode.toString().startsWith("5")) {
      console.error(serializedError);

      return res
        .statusCode(serializedError.statusCode)
        .send({ name: serializedError.name, message: "Something went wrong" });
    } else {
      return res.statusCode(serializedError.statusCode).send({
        name: serializedError.name,
        message: serializedError.message,
        stack: process.env.NODE_ENV === "development" && serializedError.stack,
      });
    }
  });
};
