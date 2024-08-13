import httpStatus from "http-status";
import { IMiddlewareHandler } from "..";
import { BaseError } from "../errors.ts";

export const errorHandler: IMiddlewareHandler = (req, res, next) => {
  return next().catch((err: unknown) => {
    // Serialize all the errors to BaseError
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

    // Log the error and send response
    if (serializedError.statusCode.toString().startsWith("5")) {
      // Better to log the error to a logging service here, like Sentry.
      console.error(serializedError);

      // Send a generic response to hide error details as it is 500
      return res
        .statusCode(serializedError.statusCode)
        .send({ name: serializedError.name, message: "Something went wrong" });
    } else {
      // it is just a 400 error, send the response
      return res.statusCode(serializedError.statusCode).send({
        name: serializedError.name,
        message: serializedError.message,
        stack: process.env.NODE_ENV === "development" && serializedError.stack, // send the stack for debugging in dev environment
      });
    }
  });
};
