import { apiRouter, IRouteHandler, processRequest, TNextContext } from "@/libs";
import { protect } from "@/libs/middlewares/protect";
import { validate } from "@/libs/middlewares/validate";
import { NextRequest } from "next/server";
import {
  postPayloadSchema,
  postsquerySchema,
  TPostPayload,
  TPostQuery,
} from "./schemas";

type TResponseData = { id: string; title: string; description: string };

const getPostsHandler: IRouteHandler<
  unknown,
  TPostQuery,
  unknown,
  TResponseData[]
> = async (req, res) => {
  // your logic goes here
  return res.statusCode(200).send([
    {
      id: "some-unique-id",
      title: "some title " + req.query.page + " " + req.query.limit,
      description: "some description",
    },
  ]);
};

const createPostHandler: IRouteHandler<
  unknown,
  unknown,
  TPostPayload,
  TResponseData
> = async (req, res) => {
  // your logic goes here
  return res.statusCode(201).send({
    id: "some-generated-unique-id",
    title: req.payload.title,
    description: req.payload.description,
  });
};

const getRouter = apiRouter()
  .use(protect)
  .use(validate("query", postsquerySchema))
  .get(getPostsHandler);

export function GET(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, getRouter);
}

const postRouter = apiRouter()
  .use(protect)
  .use(validate("payload", postPayloadSchema))
  .post(createPostHandler);

export function POST(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, postRouter);
}
