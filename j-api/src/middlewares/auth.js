import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "未提供授權 token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // => { guestId: "...", role: "guest" }
    next();
  } catch {
    res.status(401).json({ message: "token 無效或已過期" });
  }
};
