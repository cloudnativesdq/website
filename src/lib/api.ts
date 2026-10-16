// Public, read-only JSON: any site may fetch it.
export const json = (data: unknown) =>
  Response.json(data, { headers: { "Access-Control-Allow-Origin": "*" } });
