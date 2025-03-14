import mongoose from "mongoose";


const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 255 },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: { type: String, required: true, minlength: 8 },
  phone: {
    type: String,
    required: true,
    match: [/^\d{3}-\d{3}-\d{4}$/, "Phone must be in format XXX-XXX-XXXX"],
  },
  role: { type: String, enum: ["user", "admin"], default: "user", required: true },
  isBlocked: { type: Boolean, default: false },
  registeredAt: { type: Date, default: Date.now },
  license: {
    fileUrl: { type: String, default: null },
    uploadedAt: { type: Date, default: null },
  },
});

export default  mongoose.model("User", UserSchema);