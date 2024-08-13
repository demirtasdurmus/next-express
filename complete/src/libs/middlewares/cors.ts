import { IMiddlewareHandler } from "..";

export const cors: IMiddlewareHandler = async (req, res, next) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.statusCode(204).send(null);
  }

  return next();
};
