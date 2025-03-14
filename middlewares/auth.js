import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import asyncHandler from "./asyncHandler.js";

dotenv.config();

// Verify JWT Token
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "karanbagal01234");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403);
    throw new Error("Invalid or expired token.");
  }
});

// Check if user has required role
export const authorize = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Forbidden. You do not have access.");
    }
    next();
  });
};
