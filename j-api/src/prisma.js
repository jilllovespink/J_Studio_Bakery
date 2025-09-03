// src/prisma.js
import { PrismaClient } from "@prisma/client";

// 建立 PrismaClient 單例
export const prisma = new PrismaClient();
