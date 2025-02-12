import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["car", "motorcycle"],
      required: true,
      trim: true,
    },
    cc: {
      type: Number,
      required: [
        function (this: { type: string }) {
          return this.type === "motorcycle";
        },
        "cc is required when type is moto",
      ],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
