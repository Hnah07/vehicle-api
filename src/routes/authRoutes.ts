import express from "express";
import { register, login, logout } from "../controllers/authController";

const router = express.Router();

router.post("/register", register).post("/login", login).post("/logout", logout);

export default router;