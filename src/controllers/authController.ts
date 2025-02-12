import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV } from "../config/env";
import validator from "validator";

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Name, email and password from the body
    const { name, email, password } = req.body;
    // does the user exist?
    const user = await User.findOne({ email });
    if (user) {
      // if (req.headers.origin === "http://localhost:3000") {
      //   res.locals.error = "User already exists";
      //   return;
      // }
      res.status(403).json({
        message: "User already exists",
      });
      return;
    }
    const isStrongPassword = validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      // returnScore: true -> gebruiken voor groepswerk
    });
    if (!isStrongPassword) {
      res.status(403).json({
        message: "Password is not strong enough...",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // spread operator gebruiken om de req.body in te lezen, je kan ook de normale manier gebruiken ({name, email, password:hashedPassword})
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        // id is belangrijk voor de frontend om de user te krijgen
        _id: newUser._id,
        email: newUser.email,
      },
      // de JWT token moet je altijd typen en dit dit als een string.
      // altijd dubbel checken of de token bestaat.
      JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    // maak ook een condition moest de JWT_SECRET er niet zijn.
    if (!JWT_SECRET) {
      res.status(500).json({
        message: "JWT_SECRET is not defined",
      });
      return;
    }
    // om die aan de cookies toe te kennen.
    // (key, hetgeen ge in de cookie steekt, hetgeen je wil meegeven)
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // hele dag
      // zo kan er in de frontend niks aangepast worden heel belangrijk
      httpOnly: true,
      // in development moet false staan, in production true
      // anders is het NODE_ENV === "production" ? true : false;
      secure: NODE_ENV === "production" ? true : false,
      sameSite: "lax",
    });
    const userObject = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };
    // if (req.headers.origin === "http://localhost:3000") {
    //   res.redirect("/");
    //   return;
    // }
    res.status(201).json({ status: "succes", data: newUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "User does not exist, please register!",
      });
      return;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({
        message: "Unauthorized!",
      });
      return;
    }
    if (!JWT_SECRET) {
      res.status(500).json({
        message: "JTW_SECRET is not defined!",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // hele dag
      // zo kan er in de frontend niks aangepast worden heel belangrijk
      httpOnly: true,
      // in development moet false staan, in production true
      // anders is het NODE_ENV === "production" ? true : false;
      secure: false,
      sameSite: "lax",
    });
    const userObject = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    res.status(200).json({ status: "succes", data: userObject });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", {
      maxAge: 1, // hele dag
      // zo kan er in de frontend niks aangepast worden heel belangrijk
      httpOnly: true,
      // in development moet false staan, in production true
      // anders is het NODE_ENV === "production" ? true : false;
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
