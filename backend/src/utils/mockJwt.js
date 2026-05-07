const base64UrlEncode = (value) => {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const createMockJwt = (payload) => {
  const header = { alg: "HS256", typ: "JWT", mock: true };
  const signatureSeed = `${Date.now()}-${Math.random()}`;

  return [
    base64UrlEncode(JSON.stringify(header)),
    base64UrlEncode(JSON.stringify(payload)),
    base64UrlEncode(signatureSeed)
  ].join(".");
};
