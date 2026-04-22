import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

export const GET_HANDLER = REST_GET(config);
export const POST_HANDLER = REST_POST(config);
export const DELETE_HANDLER = REST_DELETE(config);
export const PATCH_HANDLER = REST_PATCH(config);
export const PUT_HANDLER = REST_PUT(config);
export const OPTIONS_HANDLER = REST_OPTIONS(config);

export {
  DELETE_HANDLER as DELETE,
  GET_HANDLER as GET,
  OPTIONS_HANDLER as OPTIONS,
  PATCH_HANDLER as PATCH,
  POST_HANDLER as POST,
  PUT_HANDLER as PUT,
};
