import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  username: { type: String, required: [true, "Username is required."] },
  name: { type: String, required: [true, "Name is required."] },
  email: { type: String, required: [true, "Email is required."] },
  password: { type: String, required: [true, "Password is required."] },
  avatar: { type: String, required: [false] },
  createdAt: { type: Date, default: Date.now },
});

const user = mongoose.model("users", userSchema);

export { user, userSchema };
