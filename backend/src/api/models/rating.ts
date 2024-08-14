import mongoose from "mongoose";
import { getNextSequenceValue } from "./counter"; // Importuj funkciju iz counter.ts

const Schema = mongoose.Schema;

const RatingSchema = new Schema(
  {
    id: { type: Number, unique: true },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    }, // Referenca na recept
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Ocene od 1 do 5
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Ako želiš da koristiš custom id umesto MongoDB-ovog automatskog _id
);

// Pre-save hook za automatsko generisanje id-a
RatingSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.id = await getNextSequenceValue("ratings");
  }
  next();
});

const Rating = mongoose.model("Rating", RatingSchema, "ratings");

export default Rating;
