import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    id: { type: Number, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    photo: {
      data: Buffer,
      contentType: String,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String, default: "user" },
    status: { type: String, default: "inactive" },
    favouriteRecepies: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    ],
    recepiesMade: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    likedRecepies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
    commentedRecepies: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", UserSchema, "users");
