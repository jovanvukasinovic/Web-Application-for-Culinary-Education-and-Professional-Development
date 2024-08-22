import express from "express";
import multer from "multer";
import { RecipeController } from "../controllers/recipe.controller";

const recipeRouter = express.Router();
const upload = multer(); // Initialize multer without specifying storage

const recipeController = new RecipeController();

recipeRouter.get("/all", (req, res) =>
  recipeController.getAllRecipes(req, res)
);

recipeRouter.get("/search", (req, res) =>
  recipeController.searchRecipes(req, res)
);

recipeRouter.get("/recipe/:id", (req, res) =>
  recipeController.getRecipeById(req, res)
);

recipeRouter.post("/add", upload.single("image"), (req, res) =>
  recipeController.addNewRecipe(req, res)
);

recipeRouter.post("/recipe/comment", (req, res) =>
  recipeController.addCommentAndRating(req, res)
);
recipeRouter.put("/recipe/edit-comment", (req, res) =>
  recipeController.updateCommentAndRating(req, res)
);

recipeRouter.delete("/recipe-delete-comment", (req, res) => {
  recipeController.deleteComment(req, res);
});

export default recipeRouter;
