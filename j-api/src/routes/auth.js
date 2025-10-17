import express from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.get("/guest", (req, res) => {
  const guestId = randomUUID();
  const token = jwt.sign({ guestId, role: "guest" }, JWT_SECRET, {
    expiresIn: "30d",
  });
  res.json({ token });
});

export default router;
