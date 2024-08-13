import { z } from "zod";
import { IMiddlewareHandler } from "..";
import { BadRequestError } from "../errors.ts";

export type TValidationMap = "params" | "query" | "payload";

export function validate(
  validationMap: TValidationMap,
  schema: z.ZodSchema
): IMiddlewareHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[validationMap]);

    if (parsed.error) {
      const message = parsed.error.issues.map((i) => i.message).join(", ");
      throw new BadRequestError(message);
    }

    if (parsed.data) {
      req[validationMap] = parsed.data;
    }

    return next();
  };
}
