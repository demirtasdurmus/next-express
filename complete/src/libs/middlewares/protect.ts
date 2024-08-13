import { IMiddlewareHandler } from "..";
import { UnauthorizedError } from "../errors.ts";
import httpStatus from "http-status";

export const protect: IMiddlewareHandler = async (req, _res, next) => {
  const validUser = true;

  if (!validUser) {
    throw new UnauthorizedError(httpStatus["401_MESSAGE"]);
  }

  req.user = {
    id: "some-unique-user-id",
    email: "some-unique-user-email",
    roles: ["USER"],
  };

  return next();
};
