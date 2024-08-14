import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Recipe from "../models/recipe";
import { getNextSequenceValue } from "../models/counter";

export class RecipeController {
  // Funkcija za vraćanje svih recepata, sortiranih po prosečnoj oceni
  getAllRecipes = async (req: Request, res: Response) => {
    try {
      // Podrazumevano sortiranje po prosečnoj oceni, od najviše ka najnižoj
      const recipes = await Recipe.aggregate([
        {
          $lookup: {
            from: "ratings", // Kolekcija ratings
            localField: "_id",
            foreignField: "recipeId",
            as: "ratings",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$ratings.rating" },
          },
        },
        {
          $sort: { averageRating: -1 }, // Sortiranje po prosečnoj oceni (najviša ocena prvo)
        },
      ]).exec();

      return res.status(200).json(recipes);
    } catch (err) {
      const error = err as Error; // Kastovanje na tip Error
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Dohvatanje jednog recepta po ID-u
  getRecipeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Validacija ID-a
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      const recipe = await Recipe.findById(id).exec();

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      return res.status(200).json(recipe);
    } catch (err) {
      const error = err as Error; // Kastovanje na tip Error
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Funkcija za pretragu recepata sa podrškom za filtriranje i sortiranje
  searchRecipes = async (req: Request, res: Response) => {
    try {
      const {
        mealType,
        tags,
        category,
        ingredients,
        sortBy,
        order = "desc",
      } = req.query;

      // Osnovni filter
      const filter: any = {};

      // Dodaj filtere ako su postavljeni
      if (mealType) filter.mealType = mealType;
      if (tags) filter.tags = { $in: (tags as string).split(",") };
      if (category) filter.category = { $in: (category as string).split(",") };
      if (ingredients)
        filter.ingredients = { $all: (ingredients as string).split(",") };

      // Sortiraj recepte prema parametru `sortBy` i redosledu `order`
      let sort: any = {};
      if (sortBy) {
        sort[sortBy as string] = order === "asc" ? 1 : -1;
      } else {
        sort["createdAt"] = -1; // Podrazumevano sortiranje po datumu kreiranja (najnovije prvo)
      }

      // Pronađi recepte prema filterima i sortiraj
      const recipes = await Recipe.find(filter).sort(sort).exec();

      return res.status(200).json(recipes);
    } catch (err) {
      const error = err as Error; // Kastovanje na tip Error
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Dodavanje novog recepta
  addNewRecipe = async (req: Request, res: Response) => {
    try {
      const { name, category, description, ingredients, tags, createdBy } =
        req.body;

      // Validacija obaveznih polja
      if (
        !name ||
        !category ||
        !description ||
        !ingredients ||
        !tags ||
        !createdBy
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Generisanje sledećeg ID-a
      const newId = await getNextSequenceValue("recipes");

      const newRecipe = new Recipe({
        id: newId,
        name,
        category,
        description,
        ingredients,
        tags,
        createdBy,
        comments: [], // Prazan niz za komentare
        ratings: [], // Prazan niz za ocene
      });

      const savedRecipe = await newRecipe.save();

      return res
        .status(201)
        .json({ message: "Recipe added successfully", recipe: savedRecipe });
    } catch (err) {
      const error = err as Error; // Kastovanje na tip Error
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };
}
