import express from "express";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
} from "../controllers/vehicleController";

const router = express.Router();

router
  .get("/", getAllVehicles)
  .get("/:id", getVehicle)
  .post("/", createVehicle)
  .put("/:id", updateVehicle)
  .delete("/:id", deleteVehicle);

export default router;
