import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "gestao-financeira-secret";

export function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const [, token] = authorization?.split(" ") ?? [];

  if (!token) {
    return res.status(401).json({ error: "Token não informado" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
