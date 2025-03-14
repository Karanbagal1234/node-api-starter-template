import mongoose from "mongoose";

const CarSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 255 },
    type: { type: String, enum: ["Hatchback", "Sedan", "SUV"], required: true },
    fuel: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true,
    },
    transmission: { type: String, enum: ["Manual", "Automatic"], required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    specs: {
      mileage: { type: String, required: true },
      engine: { type: String, required: true },
      seats: { type: Number, required: true, min: 1 },
    },
    gallery: [{ type: String }],
    status: {
      type: String,
      enum: ["Available", "Booked", "Maintenance"],
      default: "Available",
      required: true,
    },
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  });
  
  export default  mongoose.model("Car", CarSchema);