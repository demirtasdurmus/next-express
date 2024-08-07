import { apiRouter, IRouteHandler, processRequest, TNextContext } from "@/libs";
import { protect } from "@/libs/middlewares/protect";
import { NextRequest } from "next/server";

type TParams = { id: string };
type TPayload = { title: string; description: string };
type TResponseData = { id: string; title: string; description: string };

const getPostByIdHandler: IRouteHandler<
  TParams,
  unknown,
  unknown,
  TResponseData
> = async (req, res) => {
  return res.statusCode(200).send({
    id: "some-unique-id",
    title: "some title",
    description: "some description" + ` id: ${req.params.id}`,
  });
};

const updatePostByIdHandler: IRouteHandler<
  TParams,
  unknown,
  TPayload,
  TResponseData
> = async (req, res) => {
  return res.statusCode(200).send({
    id: req.params.id,
    title: req.payload.title + " updated",
    description: req.payload.description + " updated",
  });
};

const deletPostByIdHandler: IRouteHandler<TParams, unknown, unknown> = async (
  req,
  res
) => {
  console.log(req.params.id, "resource deleted");
  return res.statusCode(200).send({ message: "Resource deleted" });
};

const router = apiRouter()
  .use(protect)
  .get(getPostByIdHandler)
  .patch(updatePostByIdHandler)
  .delete(deletPostByIdHandler);

export function PATCH(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}

export function GET(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}

export function DELETE(req: NextRequest, context: TNextContext) {
  return processRequest(req, context, router);
}
