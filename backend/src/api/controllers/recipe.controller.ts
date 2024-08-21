import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Recipe from "../models/recipe";
import Comment from "../models/comment";
import Rating from "../models/rating";

export class RecipeController {
  // Funkcija za vraćanje svih recepata, sortiranih po prosečnoj oceni
  getAllRecipes = async (req: Request, res: Response) => {
    try {
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
            commentCount: { $size: "$comments" },
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

      // Pronalaženje recepta po ID-u i povlačenje povezanih komentara i ocena
      const recipe = await Recipe.findById(id)
        .populate({
          path: "comments",
          select: "username comment createdAt", // Povlači samo potrebna polja
        })
        .populate({
          path: "ratings",
          select: "username rating createdAt", // Povlači samo potrebna polja
        })
        .lean() // Optimizacija performansi
        .exec();

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
      // Parsiranje ingredients ako dolazi kao JSON string
      const parsedIngredients = JSON.parse(ingredients);

      const newRecipe = new Recipe({
        name,
        category: category.split(","), // Pretvoriti string u niz ako dolazi kao string
        description,
        ingredients: parsedIngredients,
        tags: tags.split(","), // Pretvoriti string u niz ako dolazi kao string
        createdBy,
        comments: [], // Prazan niz za komentare
        ratings: [], // Prazan niz za ocene
      });

      // Dodavanje slike ako postoji
      if (req.file) {
        newRecipe.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

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

  // addCommentAndRating = async (req: Request, res: Response) => {
  //   try {
  //     const { recipeId, userId, username, commentText, ratingValue } = req.body;

  //     // Validacija ID-a recepta
  //     if (!mongoose.Types.ObjectId.isValid(recipeId)) {
  //       return res.status(400).json({ message: "Invalid recipe ID" });
  //     }

  //     // Pronalaženje recepta
  //     const recipe = await Recipe.findById(recipeId);
  //     if (!recipe) {
  //       return res.status(404).json({ message: "Recipe not found" });
  //     }

  //     // Kreiranje komentara
  //     if (commentText) {
  //       const newComment = new Comment({
  //         recipeId,
  //         username,
  //         comment: commentText,
  //       });
  //       await newComment.save();
  //       recipe.comments.push(newComment);
  //     }

  //     // Kreiranje ocene
  //     if (ratingValue) {
  //       const newRating = new Rating({
  //         recipeId,
  //         username,
  //         rating: ratingValue,
  //       });
  //       await newRating.save();
  //       recipe.ratings.push(newRating);
  //     }

  //     // Ažuriranje recepta sa novim komentarima i ocenama
  //     await recipe.save();

  //     return res
  //       .status(200)
  //       .json({ message: "Comment and rating added successfully." });
  //   } catch (err) {
  //     const error = err as Error; // Kastovanje na tip Error
  //     console.error(error.message);
  //     return res
  //       .status(500)
  //       .json({ message: "Server error", error: error.message });
  //   }
  // };

  // Dodavanje komentara i ocene
  addCommentAndRating = async (req: Request, res: Response) => {
    try {
      const { recipeId, userId, username, commentText, ratingValue } = req.body;

      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Kreiranje komentara
      if (commentText) {
        const newComment = new Comment({
          recipeId,
          userId,
          username, // Uveri se da je `username` prosleđen ovde
          comment: commentText,
        });
        await newComment.save();
        recipe.comments.push(newComment._id); // Sačuvaj samo ID komentara
      }

      // Kreiranje ocene
      if (ratingValue) {
        const newRating = new Rating({
          recipeId,
          userId,
          username, // Uveri se da je `username` prosleđen ovde
          rating: ratingValue,
        });
        await newRating.save();
        recipe.ratings.push(newRating._id); // Sačuvaj samo ID ocene
      }

      await recipe.save(); // Sačuvaj referencu na komentare i ocene
      return res
        .status(200)
        .json({ message: "Comment and rating added successfully." });
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Update user comment and rating
  updateCommentAndRating = async (req: Request, res: Response) => {
    const { recipeId, username, userId, commentText, ratingValue } = req.body;

    try {
      // Pronađi recept
      const recipe = await Recipe.findById(recipeId).exec();

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Nađi postojeći komentar i ocenu korisnika
      const existingComment = await Comment.findOne({
        recipeId,
        username,
      }).exec();
      const existingRating = await Rating.findOne({
        recipeId,
        username,
      }).exec();

      // Ažuriraj postojeći komentar ako postoji
      if (existingComment && commentText) {
        existingComment.comment = commentText;
        await existingComment.save();
      } else if (commentText) {
        // Ako komentar ne postoji, kreiraj novi
        const newComment = new Comment({
          recipeId,
          username,
          comment: commentText,
        });
        await newComment.save();
        recipe.comments.push(newComment._id);
      }

      // Ažuriraj postojeću ocenu ako postoji
      if (existingRating && ratingValue) {
        existingRating.rating = ratingValue;
        await existingRating.save();
      } else if (ratingValue) {
        // Ako ocena ne postoji, kreiraj novu
        const newRating = new Rating({
          recipeId,
          username,
          rating: ratingValue,
        });
        await newRating.save();
        recipe.ratings.push(newRating._id);
      }

      // Sačuvaj referencu na komentare i ocene u receptu
      await recipe.save();

      return res.status(200).json({
        message: "Comment and rating updated successfully",
        recipe,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
}
