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
        { $match: { status: "active" } },
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

  // Funkcija za vraćanje svih recepata, sortiranih po prosečnoj oceni
  getAllRecipesByChef = async (req: Request, res: Response) => {
    try {
      const recipes = await Recipe.aggregate([
        { $match: { status: "inactive" } },
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

  // Funkcija za vraćanje svih recepata, sortiranih po prosečnoj oceni
  getAllRecipesByAdmin = async (req: Request, res: Response) => {
    try {
      // Prvo povuci sve recepte
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

      // Kreiraj listu `createdBy` ID-ova iz recepata
      const userIds = recipes.map((recipe: any) => recipe.createdBy);

      // Povuci odgovarajuće korisnike iz baze
      const users = await User.find({ _id: { $in: userIds } })
        .lean()
        .exec();

      // Mapiraj korisnike na osnovu njihovih ID-ova
      const userMap = users.reduce((map: any, user: any) => {
        map[user._id] = user.username;
        return map;
      }, {});

      // Dodeli `username` umesto `_id` u svakom receptu
      const recipesWithUsernames = recipes.map((recipe: any) => {
        return {
          ...recipe,
          createdBy: userMap[recipe.createdBy] || "None", // Postavi "None" ako autor ne postoji
        };
      });

      // Dodavanje imageBase64 polja
      const recipesWithBase64Images = recipesWithUsernames.map(
        (recipe: any) => {
          return {
            ...recipe,
            imageBase64: recipe.image?.data
              ? recipe.image.data.toString("base64")
              : null,
          };
        }
      );

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
        {
          $match: {
            status: "active",
            ...filter,
          },
        },
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

  // Brisanje komentara i ocene
  deleteComment = async (req: Request, res: Response) => {
    const { recipeId, username } = req.body;

    // console.log(recipeId);
    // console.log(username);

    try {
      // Pronađi recept
      const recipe = await Recipe.findById(recipeId).exec();

      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Pronađi komentar koji odgovara korisniku i receptu
      const comment = await Comment.findOneAndDelete({
        recipeId: recipeId,
        username: username,
      }).exec();

      // Pronađi ocenu koja odgovara korisniku i receptu
      const rating = await Rating.findOneAndDelete({
        recipeId: recipeId,
        username: username,
      }).exec();

      if (!comment && !rating) {
        return res
          .status(404)
          .json({ message: "Comment and rating not found" });
      }

      // Ažuriraj recept i ukloni ID-ove komentara i ocene
      if (comment) {
        recipe.comments = recipe.comments.filter(
          (commentId) => !commentId.equals(comment._id)
        );
      }

      if (rating) {
        recipe.ratings = recipe.ratings.filter(
          (ratingId) => !ratingId.equals(rating._id)
        );
      }

      // Sačuvaj izmenjeni recept
      await recipe.save();

      return res.status(200).json({
        message: "Comment and associated rating deleted successfully",
        recipe,
      });
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
          $match: { status: "active" },
        },
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

  // Funkcija za dohvatanje favourites recepata od strane korisnika
  getFavouriteRecipes = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(userId)
        .populate({
          path: "favouriteRecepies",
          match: { status: "active" },
          select: "name category tags image comments favourites",
          populate: [
            {
              path: "ratings",
              select: "rating",
            },
          ],
        })
        .lean()
        .exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Izračunavanje prosečne ocene za svaki recept
      const favouriteRecipesWithAvgRating = user.favouriteRecepies.map(
        (recipe: any) => {
          const totalRating = recipe.ratings.reduce(
            (sum: number, rating: any) => sum + rating.rating,
            0
          );
          const averageRating =
            recipe.ratings.length > 0 ? totalRating / recipe.ratings.length : 0;

          return {
            ...recipe,
            averageRating,
          };
        }
      );

      return res.status(200).json(favouriteRecipesWithAvgRating);
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

      const recipes = await Recipe.find({ createdBy: userId })
        .populate({
          path: "ratings",
          select: "rating",
        })
        .lean()
        .exec();

      // Izračunavanje prosečne ocene za svaki recept
      const recipesWithAvgRating = recipes.map((recipe: any) => {
        const totalRating = recipe.ratings.reduce(
          (sum: number, rating: any) => sum + rating.rating,
          0
        );
        const averageRating =
          recipe.ratings.length > 0 ? totalRating / recipe.ratings.length : 0;

        return {
          ...recipe,
          averageRating,
        };
      });

      return res.status(200).json(recipesWithAvgRating);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      return res
        .status(500)
        .json({ message: "Server error: getRecipesByUser" });
    }
  };

  // Funkcija za ažuriranje statusa recepta
  updateRecipeStatus = async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    const { status } = req.body;

    try {
      // Provera važenja ID-a
      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      // Ažuriranje statusa recepta
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        { status },
        { new: true }
      ).exec();

      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      return res.status(200).json({
        message: `Recipe status updated to ${status}`,
        recipe: updatedRecipe,
      });
    } catch (error) {
      const err = error as Error;
      console.error("Error updating recipe status:", err.message);
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  };

  // Funkcija za brisanje recepta
  deleteRecipeByIdByAdmin = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { recipeId } = req.body;

      // Validacija ID-a
      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        console.log(`Invalid recipe ID: ${recipeId}`);
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      // Pronađi recept
      const recipe = await Recipe.findById(recipeId).exec();
      if (!recipe) {
        console.log(`Recipe not found: ${recipeId}`);
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Pronađi sve komentare i ocene vezane za recept
      const commentIds = recipe.comments;
      const ratingIds = recipe.ratings;

      console.log(
        `Found ${commentIds.length} comments and ${ratingIds.length} ratings to delete for recipe ${recipeId}`
      );

      // Obrisi komentare i ocene iz baza
      const deleteCommentsResult = await Comment.deleteMany({
        _id: { $in: commentIds },
      }).exec();
      const deleteRatingsResult = await Rating.deleteMany({
        _id: { $in: ratingIds },
      }).exec();

      console.log(
        `Deleted ${deleteCommentsResult.deletedCount} comments and ${deleteRatingsResult.deletedCount} ratings`
      );

      // Ažuriraj favorite recepte kod svih korisnika
      const updateUsersResult = await User.updateMany(
        { favouriteRecepies: recipeId },
        { $pull: { favouriteRecepies: recipeId } }
      ).exec();

      console.log(
        `Removed recipe from favourites for ${updateUsersResult.modifiedCount} users`
      );

      // Na kraju, obriši recept iz baze
      const recipeDeletionResult = await Recipe.deleteOne({
        _id: recipeId,
      }).exec();
      if (recipeDeletionResult.deletedCount === 0) {
        console.log(`Failed to delete recipe: ${recipeId}`);
        return res.status(404).json({ message: "Recipe deletion failed" });
      }

      console.log(
        `Recipe and associated data deleted successfully for recipeId: ${recipeId}`
      );
      return res
        .status(200)
        .json({ message: "Recipe and associated data deleted successfully" });
    } catch (err) {
      console.error(`Error in deleteRecipeByIdByAdmin: ${err}`);
      return res
        .status(500)
        .json({ message: "Server error: deleteRecipeByIdByAdmin" });
    }
  };
}
