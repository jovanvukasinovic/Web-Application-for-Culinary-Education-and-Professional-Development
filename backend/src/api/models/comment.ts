import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const CommentSchema = new Schema(
  {
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    username: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Comment", CommentSchema, "comments");
