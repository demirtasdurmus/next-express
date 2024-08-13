import { z } from "zod";
import { IMiddlewareHandler } from "..";
import { BadRequestError } from "../errors.ts";

export type TValidationMap = "params" | "query" | "payload";

export function validate(
  validationMap: TValidationMap,
  schema: z.ZodSchema
): IMiddlewareHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[validationMap]);

    // Check if there are validation errors and send 400 response if so
    if (parsed.error) {
      const message = parsed.error.issues.map((i) => i.message).join(", ");
      // return res.statusCode(400).send({ message });
      throw new BadRequestError(message);
    }

    // If no validation errors, append the parsed data to the req object
    if (parsed.data) {
      req[validationMap] = parsed.data;
    }

    // Call the next middleware/handler in the chain
    return next();
  };
}
