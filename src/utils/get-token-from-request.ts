export const getTokenFromRequest = (req) => {
  let token;

  const tokenQuery = req.query.token;
  if (tokenQuery) {
    token = tokenQuery;
  }
  const tokenBody = req.body.token;
  if (tokenBody) {
    token = tokenBody;
  }
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  return token;
}
