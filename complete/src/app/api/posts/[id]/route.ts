import { apiRouter, IRouteHandler, processRequest, TNextContext } from "@/libs";
import { protect } from "@/libs/middlewares/protect";
import { validate } from "@/libs/middlewares/validate";
import { NextRequest } from "next/server";
import {
  postParamsSchema,
  postPayloadSchema,
  TPostParams,
  TPostPayload,
} from "../schemas";
import { NotFoundError } from "@/libs/errors.ts";

type TResponseData = { id: string; title: string; description: string };

const getPostByIdHandler: IRouteHandler<
  TPostParams,
  unknown,
  unknown,
  TResponseData
> = async (req, res) => {
  const isFound = true;

  if (!isFound) {
    throw new NotFoundError(`Resource with id: ${req.params.id} not found`);
  }

  return res.statusCode(200).send({
    id: req.params.id,
    title: "some title",
    description: "some description",
  });
};

const updatePostByIdHandler: IRouteHandler<
  TPostParams,
  unknown,
  TPostPayload,
  TResponseData
> = async (req, res) => {
  // your logic here
  return res.statusCode(200).send({
    id: req.params.id,
    title: req.payload.title + " updated",
    description: req.payload.description + " updated",
  });
};

const deletPostByIdHandler: IRouteHandler<
  TPostParams,
  unknown,
  unknown
> = async (req, res) => {
  // your logic here
  return res
    .statusCode(200)
    .send({ message: `Resource with ${req.params.id} is deleted` });
};

const router = apiRouter()
  .use(protect)
  .use(validate("params", postParamsSchema))
  .get(getPostByIdHandler)
  .delete(deletPostByIdHandler)
  .use(validate("payload", postPayloadSchema))
  .patch(updatePostByIdHandler);

export function PATCH(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}

export function GET(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}

export function DELETE(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}
