import { NextRequest, NextResponse } from "next/server";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { createEdgeRouter, NextHandler } from "next-connect";
import { jsonParser } from "./middlewares/json-parser";
import { cors } from "./middlewares/cors";
import { errorHandler } from "./middlewares/error-handler";

// Type for Next.js request context, used as the second parameter in HTTP methods
export type TNextContext = {
  params?: Record<string, string>;
};

// Extend NextRequest init interface to include our fields
export interface CustomRequestInit extends RequestInit {
  params?: any;
  query?: any;
  payload?: any;
  user?: any;
}

export type TUser = { id: string; email: string; roles: string[] };

// Extend the NextRequest class for custom handling
export class CustomRequest<
  TParams = unknown,
  TQuery = unknown,
  TPayload = unknown
> extends NextRequest {
  params!: TParams;
  query!: TQuery;
  payload!: TPayload;
  user?: TUser; // Define your user/session type for authentication

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

// Extend the NextResponse class for express-like response handling
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

// Route handler interface for defining reusable route functions
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

// Middleware handler interface for defining reusable middlewares
// Do not forget to import NextHandler type from next-connect
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

// Function to create apiRouter instances
// Later we will add global middlewares here
// Such as jsonParser or globalErrorHandler etc.
export function apiRouter() {
  return (
    createEdgeRouter<CustomRequest<any, any, any>, CustomResponse<any>>()
      // Global middlewares here
      .use(errorHandler)
      .use(cors)
      .use(jsonParser)
  );
}

// The actual request processor function
// We will call this function with necessary parameters inside the HTTP method
export function processRequest(
  req: NextRequest,
  context: TNextContext,
  router: ReturnType<typeof createEdgeRouter<CustomRequest, CustomResponse>>
): Promise<NextResponse<unknown>> {
  // parsing queryParams from the original request
  const query = Object.fromEntries(req.nextUrl.searchParams.entries());

  // Appending the original request fields to our own Request instance.
  // Unfortunately I could not use the ... syntax as NextRequest constructor is
  // a little bit tricky 🤦‍♂️
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
    ...(req.body ? { duplex: "half" } : {}), // Required for sending request body
    params: context.params || {}, // appending params
    query, // appending query params
  });

  // Create a custom response itially to allow manipulatin by middlewares along the way
  const customRes = new CustomResponse();

  // executing the request with custom instances
  return router.run(customReq, customRes) as Promise<NextResponse<unknown>>;
}
