import mongoose from "mongoose";
import { getNextSequenceValue } from "./counter"; // Importuj funkciju iz counter.ts

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    id: { type: Number, unique: true },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    }, // Referenca na recept
    username: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Ukoliko želiš da koristiš custom id umesto MongoDB-ovog automatskog _id
);

// Pre-save hook za automatsko generisanje id-a
CommentSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.id = await getNextSequenceValue("comments");
  }
  next();
});

const Comment = mongoose.model("Comment", CommentSchema, "comments");

export default Comment;
