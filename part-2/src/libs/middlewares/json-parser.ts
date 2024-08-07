import { IMiddlewareHandler } from "..";

export const jsonParser: IMiddlewareHandler = async (req, _res, next) => {
  try {
    if (req.headers.get("content-type") === "application/json") {
      // Parse the body as json
      const payload = await req.clone().json();

      // Attach parsed body to request
      req.payload = payload;
    }
  } catch (e) {}
  return next();
};
