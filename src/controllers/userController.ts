import { Request, Response } from "express";
import { User } from "../models/userModel";
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not authorized" });
      return;
    }
    if (user._id !== id) {
      res.status(404).json({ message: "User not authorized" });
      return;
    }
    const userDetails = await User.findById(id)
      .select("-password")
      .populate("favorites");
    res.status(200).json({ status: "success", data: userDetails });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vehicleId } = req.body;
    const user = req.user;
    if (!user) {
      //safety clause
      res.status(403).json({ message: "Unautherized" });
      return;
    }
    if (id !== user._id) {
      res.status(403).json({ message: "Unautherized" });
      return;
    }
    //$push kijkt niet naar duplicates, addToSet wel
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $addToSet: { favorites: vehicleId },
      },
      { new: true }
    );

    res.status(200).json({ status: "success", data: updatedUser });
    // const {vehicleId} =req.query = ?vehicleId=sewrwr
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vehicleId } = req.body;
    const user = req.user;
    if (!user) {
      //safety clause
      res.status(403).json({ message: "Unautherized" });
      return;
    }
    if (id !== user._id) {
      res.status(403).json({ message: "Unautherized" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $pull: { favorites: vehicleId } },
      { new: true, select: "-password" }
    ).populate("favorites");
    res.status(200).json({ status: "success", data: updatedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
