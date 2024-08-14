import mongoose from "mongoose";
import CommentSchema from "./comment"; // Importuj Comment šemu
import RatingSchema from "./rating"; // Importuj Rating šemu
import { getNextSequenceValue } from "./counter"; // Importuj funkciju iz counter.ts

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
    id: { type: Number, unique: true, required: true }, // Jedinstveni ID za svaki recept
    name: { type: String, required: true }, // Ime recepta
    category: {
      type: [{ type: String, enum: Object.values(Categories) }],
      required: true,
    },
    description: { type: String, required: true }, // Opis pripreme
    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String },
      },
    ], // Sastojci za recept
    tags: {
      type: [{ type: String, enum: Object.values(Tags) }],
      required: true,
    },
    comments: {
      type: [CommentSchema],
      default: [], // Prazan niz kao podrazumevana vrednost
    }, // Komentari
    ratings: {
      type: [RatingSchema], // Prazan niz kao podrazumevana vrednost
      default: [],
    }, // Ocene
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Korisnik koji je kreirao recept
    createdAt: { type: Date, default: Date.now }, // Vreme kreiranja
    updatedAt: { type: Date, default: Date.now }, // Vreme poslednje izmene
    image: {
      data: Buffer,
      contentType: String,
    }, // Opcionalna slika za recept
  },
  { timestamps: true } // Automatski dodaje createdAt i updatedAt polja
);

// Pre-save hook za automatsko generisanje id-a
RecipeSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.id = await getNextSequenceValue("recipes");
  }
  next();
});

const Recipe = mongoose.model("Recipe", RecipeSchema, "recipes");

export default Recipe;
