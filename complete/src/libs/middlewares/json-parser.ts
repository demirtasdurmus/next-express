import { IMiddlewareHandler } from "..";

export const jsonParser: IMiddlewareHandler = async (req, _res, next) => {
  try {
    if (req.headers.get("content-type") === "application/json") {
      const payload = await req.clone().json();

      req.payload = payload;
    }
  } catch (e) {}

  return next();
};
