import session from "express-session";

export const sessionMiddleware = session({
  secret: "mysecret", // 加密 session ID 用的密鑰
  resave: false, // 如果 session 沒變更，就不要重新存
  saveUninitialized: true, // 使用者還沒存資料前也發一個 session
  cookie: {
    httpOnly: true, // 前端 JS 不能直接讀取 Cookie（安全）
    secure: false, // HTTPS 才能用，開發階段先設 false
    maxAge: 1000 * 60 * 60, // 1 小時過期
  },
});
