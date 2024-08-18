import mongoose from "mongoose";
import { CommentSchema } from "./comment";
import { RatingSchema } from "./rating";

enum Tags {
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  GlutenFree = "Gluten-Free",
  DairyFree = "Dairy-Free",
  LowCarb = "Low-Carb",
  HighProtein = "High-Protein",
  QuickEasy = "Quick & Easy",
  KidFriendly = "Kid-Friendly",
  Spicy = "Spicy",
  ComfortFood = "Comfort Food",
  Healthy = "Healthy",
  LowCalorie = "Low-Calorie",
  Keto = "Keto",
  Paleo = "Paleo",
  Seasonal = "Seasonal",
  Holiday = "Holiday",
  BudgetFriendly = "Budget-Friendly",
  OnePot = "One-Pot",
  Grilling = "Grilling",
  Dessert = "Dessert",
}

enum Categories {
  Appetizers = "Appetizers",
  MainCourse = "Main Course",
  SideDish = "Side Dish",
  Desserts = "Desserts",
  Soups = "Soups",
  Salads = "Salads",
  Beverages = "Beverages",
  Breakfast = "Breakfast",
  Brunch = "Brunch",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snacks = "Snacks",
  Baking = "Baking",
  SaucesDips = "Sauces & Dips",
  Pasta = "Pasta",
  Pizza = "Pizza",
  GrillingBBQ = "Grilling & BBQ",
  Casseroles = "Casseroles",
  Seafood = "Seafood",
  Vegetarian = "Vegetarian",
}

const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: [{ type: String, enum: Object.values(Categories) }],
      required: true,
    },
    description: { type: String, required: true },
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String },
      },
    ],
    tags: {
      type: [{ type: String, enum: Object.values(Tags) }],
      required: true,
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
    ratings: {
      type: [RatingSchema],
      default: [],
    },
    status: { type: String, default: "inactive" },
    favourites: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Recipe", RecipeSchema, "recipes");
