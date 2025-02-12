import { Request, Response } from "express";
import { Vehicle } from "../models/vehicleModel";
import { getLicense } from "../utils/helpers";

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const count = await Vehicle.find().countDocuments();
    const vehicles = await Vehicle.find()
      .limit(10)
      .skip(page ? 10 * (+page - 1) : 0)
      .sort({ createdAt: -1 });

    const pages = Math.ceil(count / 10);

    if (page && +page > pages) {
      res.status(404).json({ message: "Page not found" });
      return;
    }

    const vehiclesWithLicense = vehicles.map((vehicle) => {
      if (vehicle.type === "motorcycle" && vehicle.cc) {
        return getLicense(vehicle);
      }
      return vehicle;
    });

    res.status(200).json({
      status: "success",
      data: vehiclesWithLicense,
      pages: pages,
      page: page ? +page : 1,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    let vehicleWithLicense;

    if (vehicle.type === "motorcycle" && vehicle.cc) {
      vehicleWithLicense = getLicense(vehicle);
    } else {
      vehicleWithLicense = vehicle;
    }

    res.status(200).json({ status: "success", data: vehicleWithLicense });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body });
    res.status(201).json({ status: "success", data: vehicle });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Vehicle.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({ status: "success", data: updated });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.deleteOne({ _id: id });
    res.status(200).json({ status: "success", data: deleted });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};
