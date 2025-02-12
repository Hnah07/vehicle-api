import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    if (!JWT_SECRET) {
      res.status(500).json({ message: "No JWT_SECRET env" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET as string);
    if (!decoded) {
      res.status(402).json({ message: "Not auhorized" });
      return;
    }

    const user = {
      _id: (decoded as JwtPayload)._id, // as JwtPayload is a type assertion
      email: (decoded as JwtPayload).email,
    };
    req.user = user;
    next(); // go to the next middleware
  } catch (error: unknown) {
    console.log("Middleware error");
  }
};

export default authMiddleware;
