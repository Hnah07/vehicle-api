import express from "express";
import {
  addToFavorites,
  getUser,
  removeFromFavorites,
} from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router
  .get("/:id", authMiddleware, getUser)
  .patch("/add-to-favorites/:id", authMiddleware, addToFavorites)
  .delete("/remove-from-favorites/:id", authMiddleware, removeFromFavorites);

export default router;
