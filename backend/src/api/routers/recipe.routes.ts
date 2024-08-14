import express from "express";
import { RecipeController } from "../controllers/recipe.controller";

const recipeRouter = express.Router();
const recipeController = new RecipeController();

// Ruta za vraćanje svih recepata sortiranih po prosečnoj oceni
recipeRouter.get("/all", (req, res) =>
  recipeController.getAllRecipes(req, res)
);

// Ruta za pretragu recepata sa filtriranjem i sortiranjem
recipeRouter.get("/search", (req, res) =>
  recipeController.searchRecipes(req, res)
);

// Ruta za dohvatanje recepta po ID-u
recipeRouter.get("/:id", (req, res) =>
  recipeController.getRecipeById(req, res)
);

// Ruta za dodavanje novog recepta
recipeRouter.post("/add", (req, res) =>
  recipeController.addNewRecipe(req, res)
);

export default recipeRouter;
