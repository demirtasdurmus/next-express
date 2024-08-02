import { apiRouter, IRouteHandler, processRequest, TNextContext } from "@/libs";
import { NextRequest } from "next/server";

// These types are for type support when creating our handlers
// Later we will make use of zod, a famous library for parsing/validating data
type TQuery = { page: number; limit: number };
type TResponseData = { id: string; title: string; description: string };

const getPostsHandler: IRouteHandler<
  unknown, // since we do not expect params we passed unknown
  TQuery, // we expect query so passed the type as generic
  unknown,
  TResponseData[]
> = async (req, res) => {
  // with type support
  console.log("page: ", req.query.page, "limit: ", req.query.limit);

  return res.statusCode(200).send([
    {
      id: "some-unique-id",
      title: "some title",
      description: "some description",
    },
  ]);
};

// Create a new router instance and append the HTTP method by passing
// our handler function
// Later we will add custom middlewares before the HTTP method
const router = apiRouter().get(getPostsHandler);

// This is a strict requirement of Next.js for API routes
// Just add this function to satisfy this, and call our
// processRequest function with correct arguments
export function GET(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}
