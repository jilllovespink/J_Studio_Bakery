import session from "express-session";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "my-secret",
  resave: false, // 如果 session 沒變更，就不要重新存
  saveUninitialized: true, // 使用者還沒存資料前也發一個 session
  cookie: {
    httpOnly: true, // 前端 JS 不能直接讀取 Cookie（安全）
    secure: true, // HTTPS 才能用，開發階段先設 false
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 1 小時過期
  },
});
