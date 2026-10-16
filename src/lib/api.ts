// Public, read-only JSON: any site may fetch it.
export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Access-Control-Allow-Origin": "*" } });
