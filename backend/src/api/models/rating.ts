import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const RatingSchema = new Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Rating", RatingSchema, "ratings");
