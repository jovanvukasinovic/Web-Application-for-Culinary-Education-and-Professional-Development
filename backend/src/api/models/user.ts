import mongoose from "mongoose";
import { getNextSequenceValue } from "./counter"; // Importuj funkciju iz counter.ts

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
    ], // Referenca na omiljene recepte
    recepiesMade: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Referenca na recepte koje je korisnik napravio
    likedRecepies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }], // Referenca na lajkove na receptima
    commentedRecepies: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
    ], // Referenca na komentare na receptima
  },
  { timestamps: true } // Automatski dodaje createdAt i updatedAt polja
);

// Pre-save hook za automatsko generisanje id-a
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.id = await getNextSequenceValue("users");
  }
  next();
});

const User = mongoose.model("User", UserSchema, "users");

export default User;
