import { cookies } from "next/headers";
import { IMiddlewareHandler } from "..";

export const protect: IMiddlewareHandler = async (req, res, next) => {
  const cookie = cookies().get("session");
  // validate the cookie and extract user data, toggle the below variable to see it in action
  const validUser = true;
  // Return 401 if invalid
  if (!validUser) {
    return res.statusCode(401).send({ message: "Unauthorized" });
  }

  // Append the user data to request obj and continue if valid
  req.user = {
    id: "some-unique-user-id",
    email: "some-unique-user-email",
    roles: ["USER"],
  };

  return next();
};
