import mongoose from "mongoose";

const BookingSchema = new Schema({
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.endDate ? value < this.endDate : true;
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.startDate ? value > this.startDate : true;
        },
        message: "End date must be after start date",
      },
    },
    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      name: { type: String, required: true },
    },
    dropoffLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      name: { type: String, required: true },
    },
    totalCost: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
      required: true,
    },
    paymentCompleted: { type: Boolean, default: false },
    paymentId: { type: String, default: null }, // Transaction ID (e.g., Stripe)
    refundStatus: {
      type: String,
      enum: ["None", "Pending", "Approved", "Rejected"],
      default: "None",
    },
    createdAt: { type: Date, default: Date.now },
  });
  
  // Ensure validation runs on updates
  BookingSchema.pre("save", function (next) {
    if (this.isModified("startDate") || this.isModified("endDate")) {
      if (this.startDate >= this.endDate) {
        return next(new Error("Start date must be before end date"));
      }
    }
    next();
  });
  
export default mongoose.model("Booking", BookingSchema);