import { NextRequest, NextResponse } from "next/server";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { createEdgeRouter, NextHandler } from "next-connect";
import { jsonParser } from "./middlewares/json-parser";
import { cors } from "./middlewares/cors";
import { errorHandler } from "./middlewares/error-handler";

export type TNextContext = {
  params?: Record<string, string>;
};

export interface CustomRequestInit extends RequestInit {
  params?: any;
  query?: any;
  payload?: any;
  user?: any;
}

export type TUser = { id: string; email: string; roles: string[] };

export class CustomRequest<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown
> extends NextRequest {
  params!: TParams;
  query!: TQuery;
  payload!: TPayload;
  user?: TUser;

  constructor(input: URL | RequestInfo, init?: CustomRequestInit) {
    super(input, init);
    if (init?.params) {
      this.params = init.params;
    }

    if (init?.query) {
      this.query = init.query;
    }
  }
}

export class CustomResponse<TResponseData = unknown> extends NextResponse {
  private _statusCode: number = 200;

  statusCode(statusCode: number) {
    this._statusCode = statusCode;
    return this;
  }

  send(body: TResponseData) {
    const response = NextResponse.json(body, {
      status: this._statusCode,
      headers: this.headers,
    });

    this.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }
}

export interface IRouteHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload>,
    res: CustomResponse<TResponseData>
  ): Promise<NextResponse<TResponseData>>;
}

export interface IMiddlewareHandler<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown,
  TResponseData = unknown
> {
  (
    req: CustomRequest<TParams, TQuery, TPayload>,
    res: CustomResponse<TResponseData>,
    next: NextHandler
  ): Promise<NextResponse<TResponseData> | void>;
}

export function apiRouter() {
  return createEdgeRouter<CustomRequest<any, any, any>, CustomResponse<any>>()
    .use(errorHandler)
    .use(cors)
    .use(jsonParser);
}

export function processRequest(
  req: NextRequest,
  context: TNextContext,
  router: ReturnType<typeof createEdgeRouter<CustomRequest, CustomResponse>>
): Promise<NextResponse<unknown>> {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries());

  const customReq = new CustomRequest(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    cache: req.cache,
    credentials: req.credentials,
    geo: req.geo,
    integrity: req.integrity,
    ip: req.ip,
    keepalive: req.keepalive,
    mode: req.mode,
    redirect: req.redirect,
    referrer: req.referrer,
    referrerPolicy: req.referrerPolicy,
    signal: req.signal,
    ...(req.body ? { duplex: "half" } : {}),
    params: context.params || {},
    query,
  });

  const customRes = new CustomResponse();

  return router.run(customReq, customRes) as Promise<NextResponse<unknown>>;
}
