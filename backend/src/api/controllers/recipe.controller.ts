import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Recipe from "../models/recipe";
import Comment from "../models/comment";
import Rating from "../models/rating";
import User from "../models/user";

export class RecipeController {
  // Funkcija za vraćanje svih recepata, sortiranih po prosečnoj oceni
  getAllRecipes = async (req: Request, res: Response) => {
    try {
      const recipes = await Recipe.aggregate([
        {
          $lookup: {
            from: "ratings",
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
          $sort: { averageRating: -1 },
        },
      ]).exec();

      // Dodavanje imageBase64 polja
      const recipesWithBase64Images = recipes.map((recipe: any) => {
        return {
          ...recipe,
          imageBase64: recipe.image?.data
            ? recipe.image.data.toString("base64")
            : null,
        };
      });

      return res.status(200).json(recipesWithBase64Images);
    } catch (err) {
      const error = err as Error;
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
          select: "username comment createdAt",
        })
        .populate({
          path: "ratings",
          select: "username rating createdAt",
        })
        .lean()
        .exec();

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Dodavanje imageBase64 polja
      const recipeWithBase64Image = {
        ...recipe,
        imageBase64: recipe.image?.data
          ? recipe.image.data.toString("base64")
          : null,
      };

      return res.status(200).json(recipeWithBase64Image);
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Funkcija za pretragu recepata sa podrškom za filtriranje i sortiranje
  sortRecipes = async (req: Request, res: Response) => {
    try {
      const {
        mealType,
        tags,
        category,
        ingredients,
        sortBy,
        order = "desc",
      } = req.query;

      const filter: any = {};

      if (mealType) filter.mealType = mealType;
      if (tags) filter.tags = { $in: (tags as string).split(",") };
      if (category) filter.category = { $in: (category as string).split(",") };
      if (ingredients)
        filter.ingredients = { $all: (ingredients as string).split(",") };

      let sort: any = {};
      if (sortBy === "rating") {
        sort = { averageRating: order === "asc" ? 1 : -1 };
      } else if (sortBy === "newest") {
        sort = { createdAt: order === "asc" ? 1 : -1 };
      } else if (sortBy === "favourites") {
        sort = { favourites: order === "asc" ? 1 : -1 };
      } else {
        sort[sortBy as string] = order === "asc" ? 1 : -1;
      }

      const recipes = await Recipe.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "ratings",
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
          $sort: sort,
        },
      ]).exec();

      return res.status(200).json(recipes);
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Funkcija za pretragu recepata sa podrškom za filtriranje i sortiranje
  searchRecipes = async (req: Request, res: Response) => {
    const term = req.query.term as string;
    try {
      const recipes = await Recipe.find({
        $or: [
          { name: { $regex: term, $options: "i" } },
          { category: { $regex: term, $options: "i" } },
          { tags: { $regex: term, $options: "i" } },
        ],
      })
        .lean()
        .exec();

      // Dodavanje imageBase64 polja
      const recipesWithBase64Images = recipes.map((recipe: any) => {
        return {
          ...recipe,
          imageBase64: recipe.image?.data
            ? recipe.image.data.toString("base64")
            : null,
        };
      });

      res.status(200).json(recipesWithBase64Images);
    } catch (error) {
      console.error("Error in searchRecipes:", error);
      res.status(500).send("Server error: searchRecipes");
    }
  };

  // Dodavanje novog recepta
  addNewRecipe = async (req: Request, res: Response) => {
    try {
      const { name, category, description, ingredients, tags, createdBy } =
        req.body;

      const parsedIngredients = JSON.parse(ingredients);

      const newRecipe = new Recipe({
        name,
        category: category.split(","),
        description,
        ingredients: parsedIngredients,
        tags: tags.split(","),
        createdBy,
        comments: [],
        ratings: [],
      });

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
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

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

      if (commentText) {
        const newComment = new Comment({
          recipeId,
          userId,
          username,
          comment: commentText,
        });
        await newComment.save();
        recipe.comments.push(newComment._id);
      }

      if (ratingValue) {
        const newRating = new Rating({
          recipeId,
          userId,
          username,
          rating: ratingValue,
        });
        await newRating.save();
        recipe.ratings.push(newRating._id);
      }

      await recipe.save();
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
      const recipe = await Recipe.findById(recipeId).exec();

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      const existingComment = await Comment.findOne({
        recipeId,
        username,
      }).exec();
      const existingRating = await Rating.findOne({
        recipeId,
        username,
      }).exec();

      if (existingComment && commentText) {
        existingComment.comment = commentText;
        await existingComment.save();
      } else if (commentText) {
        const newComment = new Comment({
          recipeId,
          username,
          comment: commentText,
        });
        await newComment.save();
        recipe.comments.push(newComment._id);
      }

      if (existingRating && ratingValue) {
        existingRating.rating = ratingValue;
        await existingRating.save();
      } else if (ratingValue) {
        const newRating = new Rating({
          recipeId,
          username,
          rating: ratingValue,
        });
        await newRating.save();
        recipe.ratings.push(newRating._id);
      }

      await recipe.save();

      return res.status(200).json({
        message: "Comment and rating updated successfully",
        recipe,
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };

  // Brisanje komentara
  deleteComment = async (req: Request, res: Response) => {
    const { recipeId, commentId } = req.body;

    try {
      const recipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { $pull: { comments: commentId } },
        { new: true }
      ).exec();

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      await Comment.findByIdAndDelete(commentId).exec();

      return res
        .status(200)
        .json({ message: "Comment deleted successfully", recipe });
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getTop9Recipes = async (req: Request, res: Response) => {
    const { category } = req.params;

    try {
      let sortCriteria: any = {};

      if (category === "rating") {
        // Calculate the average rating
        sortCriteria = { averageRating: -1 };
      } else if (category === "comments") {
        // Sorting by the number of comments
        sortCriteria = { commentsCount: -1 };
      } else if (category === "favourites") {
        sortCriteria = { favourites: -1 };
      } else {
        return res.status(400).json({ message: "Invalid category" });
      }

      const recipes = await Recipe.aggregate([
        {
          $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "recipeId",
            as: "ratings",
          },
        },
        {
          $addFields: {
            commentsCount: { $size: "$comments" }, // Number of comments
            averageRating: {
              $cond: {
                if: { $eq: [{ $size: "$ratings" }, 0] },
                then: 0,
                else: { $avg: "$ratings.rating" }, // Calculating the average rating
              },
            },
          },
        },
        {
          $sort: sortCriteria, // Sorting by the specified criteria
        },
        {
          $limit: 9, // Limiting to top 9 recipes
        },
      ]).exec();

      return res.status(200).json(recipes);
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  getFavouriteRecipes = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      // Validate the user ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Find the user and populate their favourite recipes
      const user = await User.findById(userId)
        .populate({
          path: "favouriteRecepies",
          // select: "name category tags image ratings comments favourites", // Specify only the fields you need
          select: "name category tags image comments favourites", // Limit to essential fields
        })
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // const recipesWithBase64Images = user.favouriteRecepies.map(
      //   (recipe: any) => {
      //     return {
      //       ...recipe._doc,
      //       imageBase64: recipe.image?.data
      //         ? `data:${
      //             recipe.image.contentType
      //           };base64,${recipe.image.data.toString("base64")}`
      //         : null,
      //     };
      //   }
      // );

      return res.status(200).json(user.favouriteRecepies);
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // Funkcija za dohvatanje recepata kreiranih od strane korisnika
  getRecipesByUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const recipes = await Recipe.find({ createdBy: userId }).lean().exec();

      return res.status(200).json(recipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return res
        .status(500)
        .json({ message: "Server error: getRecipesByUser" });
    }
  };
}
