import express, { Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import User from "../models/user";
import Recipe from "../models/recipe";
import Comment from "../models/comment";
import Rating from "../models/rating";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export class UserController {
  // TODO: Not used
  adminLogin = async (req: express.Request, res: express.Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const admin = await User.findOne({
        username,
        password,
        role: "admin",
      }).exec();

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Konvertuj Buffer u Base64 string i kreiraj novi objekat za sliku
      let photoBase64 = null;
      if (admin.photo && admin.photo.data) {
        photoBase64 = {
          data: admin.photo.data.toString("base64"),
          contentType: admin.photo.contentType,
        };
      }

      return res.status(200).json({
        ...admin.toObject(),
        photo: photoBase64,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: adminLogin" });
    }
  };

  // TODO: Not used
  userLogin = async (req: express.Request, res: express.Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await User.findOne({ username, password }).exec();

      if (!user || user.role === "admin") {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.status === "inactive") {
        return res
          .status(403)
          .json({ message: "Account is inactive. Please contact support." });
      }

      if (user.status !== "active") {
        return res
          .status(403)
          .json({ message: "Account is inactive. Please contact support." });
      }

      // Konvertuj Buffer u Base64 string i kreiraj novi objekat za sliku
      let photoBase64 = null;
      if (user.photo && user.photo.data) {
        photoBase64 = {
          data: user.photo.data.toString("base64"),
          contentType: user.photo.contentType,
        };
      }

      return res.status(200).json({
        ...user.toObject(),
        photo: photoBase64,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: userLogin" });
    }
  };

  getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
      const users = await User.find({ role: { $in: ["user", "chef"] } })
        .lean()
        .exec();

      return res.status(200).json(users);
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching users:", error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  // TODO: Not used
  uploadProfilePicture = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const userId = req.params.userId;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };

      const user = await User.findByIdAndUpdate(
        userId,
        { photo },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.photo && user.photo.data) {
        const photoBase64 = user.photo.data.toString("base64");
        res.status(200).json({
          ...user.toObject(),
          photo: {
            data: photoBase64,
            contentType: user.photo.contentType,
          },
        });
      } else {
        res.status(200).json({
          ...user.toObject(),
          photo: null, // Ili neka druga vrednost koja signalizira da nema slike
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error: uploadProfilePicture" });
    }
  };

  // TODO: Not used
  getProfilePicture = async (req: express.Request, res: express.Response) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).exec();

      if (!user || !user.photo) {
        return res.status(404).json({ message: "User or photo not found" });
      }

      res.contentType(user.photo.contentType || "application/octet-stream");
      res.send(user.photo.data);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error: getProfilePicture" });
    }
  };

  // TODO: Not used
  getUserByUsername = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.params;

      // Validacija Username-a
      if (!mongoose.Types.ObjectId.isValid(username)) {
        return res.status(400).json({ message: "Invalid user username" });
      }

      const user = await User.findOne({ username }).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error: getUserByUsername" });
    }
  };

  // TODO: Not used
  getUserById = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  getUserByIdPost = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.body; // Ako koristite POST

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await User.findById(id).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // TODO: Not used
  deleteUserByUsernameByAdmin = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { username } = req.body;

      // Pronađi korisnika po username-u
      const user = await User.findOne({ username }).exec();
      if (!user) {
        console.log(`User not found: ${username}`);
        return res.status(404).json({ message: "User not found" });
      }

      const userId = user._id;
      console.log(`User found: ${userId}`);

      // Smanji broj favorita u svim receptima koje je korisnik favorizovao
      const updateFavoritesResult = await Recipe.updateMany(
        { _id: { $in: user.favouriteRecepies } },
        { $inc: { favourites: -1 } }
      ).exec();
      console.log(
        `Updated favourites count for ${updateFavoritesResult.modifiedCount} recipes`
      );

      // Pronađi sve komentare i ocene koje je korisnik ostavio
      const userComments = await Comment.find({ username }).exec();
      const userRatings = await Rating.find({ username }).exec();

      const commentIds = userComments.map((comment) => comment._id);
      const ratingIds = userRatings.map((rating) => rating._id);

      console.log(
        `Found ${commentIds.length} comments and ${ratingIds.length} ratings to delete`
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

      // Ukloni reference na komentare i ocene u receptima
      const removeCommentsReferencesResult = await Recipe.updateMany(
        { comments: { $in: commentIds } },
        { $pull: { comments: { $in: commentIds } } }
      ).exec();

      const removeRatingsReferencesResult = await Recipe.updateMany(
        { ratings: { $in: ratingIds } },
        { $pull: { ratings: { $in: ratingIds } } }
      ).exec();

      console.log(
        `Removed comment references from ${removeCommentsReferencesResult.modifiedCount} recipes`
      );
      console.log(
        `Removed rating references from ${removeRatingsReferencesResult.modifiedCount} recipes`
      );

      // Na kraju, obriši korisnika iz baze
      const userDeletionResult = await User.deleteOne({ _id: userId }).exec();
      if (userDeletionResult.deletedCount === 0) {
        console.log(`Failed to delete user: ${userId}`);
        return res.status(404).json({ message: "User deletion failed" });
      }

      console.log(
        `User and associated data deleted successfully for userId: ${userId}`
      );
      return res
        .status(200)
        .json({ message: "User and associated data deleted successfully" });
    } catch (err) {
      console.error(`Error in deleteUserByUsernameByAdmin: ${err}`);
      return res
        .status(500)
        .json({ message: "Server error: deleteUserByUsernameByAdmin" });
    }
  };

  // Verifikacija lozinke korisnika
  verifyPassword = async (req: express.Request, res: express.Response) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username }).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      return res
        .status(200)
        .json({ message: "Password verified successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: verifyPassword" });
    }
  };

  // Promena lozinke korisnika
  changePassword = async (req: express.Request, res: express.Response) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      const user = await User.findOne({ username }).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.password !== oldPassword) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      user.password = newPassword;
      await user.save();

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: changePassword" });
    }
  };

  // TODO: Not used
  activateUserByAdmin = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      const updateResult = await User.updateOne(
        { username },
        { $set: { status: "active" } }
      ).exec();

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: `Admin has activated the user: ${username}` });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error: activateUserByAdmin" });
    }
  };

  // TODO: Not used
  deactivateUserByAdmin = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      const updateResult = await User.updateOne(
        { username },
        { $set: { status: "inactive" } }
      ).exec();

      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: `Admin has deactivated the user: ${username}` });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Server error: deactivateUserByAdmin" });
    }
  };

  // TODO: Not used
  addUserByAdmin = async (req: express.Request, res: express.Response) => {
    try {
      const { firstname, lastname, username, password, email, phone } =
        req.body;

      // Validacija potrebnih polja
      if (!firstname || !lastname || !username || !password || !email) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Priprema objekta za profilnu fotografiju (ako postoji)
      let photo;
      if (req.file) {
        photo = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const user = new User({
        firstname,
        lastname,
        photo,
        username,
        password,
        email,
        phone,
        role: "user",
        status: "active",
      });

      // Čuvanje korisnika sa async/await
      const savedUser = await user.save();

      return res
        .status(201)
        .json({ message: "Admin added new system user", user: savedUser });
    } catch (err) {
      if ((err as any).name === "MongoError" && (err as any).code === 11000) {
        // 11000 je kod za duplikate ključeva u MongoDB-u (npr. unique username ili email)
        return res
          .status(409)
          .json({ message: "Username or email already exists" });
      }
      console.error(err);
      return res.status(500).json({
        message: "Server error: addUserByAdmin",
        error: (err as any).message,
      });
    }
  };

  // TODO: Not used
  userRegistration = async (req: express.Request, res: express.Response) => {
    try {
      const { firstname, lastname, username, password, email, phone } =
        req.body;
      const isAdmin = req.query.isAdmin === "true"; // Preuzimamo isAdmin iz query parametra

      // Proveri da li već postoji korisnik sa istim korisničkim imenom ili e-mail adresom
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res.status(409).json({
          message: "Username or email already exists.",
          conflictField:
            existingUser.username === username ? "username" : "email",
        });
      }

      // Validate required fields
      if (!firstname || !lastname || !username || !password || !email) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided." });
      }

      // Validate that a profile picture is uploaded
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Profile picture is required." });
      }

      // Prepare the profile picture object
      const photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };

      // Create a new user
      const user = new User({
        firstname,
        lastname,
        photo,
        username,
        password, // The password is unencrypted - make sure this is acceptable
        email,
        phone,
        role: "user",
        status: isAdmin ? "active" : "inactive", // Status is 'active' if admin adds and 'inactive' for regular users
      });

      // Save the user with async/await
      const savedUser = await user.save();

      return res.status(201).json({
        message:
          "User registration successful. Please wait for request approval.",
        user: savedUser,
      });
    } catch (err) {
      if ((err as any).name === "MongoError" && (err as any).code === 11000) {
        // Handle duplicate keys (e.g., username or email already exists)
        return res
          .status(409)
          .json({ message: "Username or email already exists." });
      }
      console.error(err);
      return res.status(500).json({
        message: "Server error: userRegistration",
        error: (err as any).message,
      });
    }
  };

  // TODO: Not used
  findUsername = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.body;

      // Proveravamo da li je korisničko ime već zauzeto
      const user = await User.findOne({ username }).exec();

      if (user) {
        return res.status(200).json({ message: "Username is taken." });
      } else {
        return res.status(200).json({ message: "Username is available." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: findUsername" });
    }
  };

  // TODO: Not used
  findEmail = async (req: express.Request, res: express.Response) => {
    try {
      const { mail } = req.body;

      // Proveravamo da li je e-mail već zauzet
      const user = await User.findOne({ email: mail }).exec();

      if (user) {
        return res.status(200).json({ message: "E-mail is taken." });
      } else {
        return res.status(200).json({ message: "E-mail is available." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: findEmail" });
    }
  };

  toggleFavouriteRecipe = async (
    req: express.Request,
    res: express.Response
  ) => {
    const { userId, recipeId } = req.body;

    try {
      const user = await User.findById(userId);
      const recipe = await Recipe.findById(recipeId);

      if (!user || !recipe) {
        return res.status(404).json({ message: "User or recipe not found" });
      }

      const isFavourite = user.favouriteRecepies.includes(recipeId);

      if (isFavourite) {
        user.favouriteRecepies = user.favouriteRecepies.filter(
          (id) => id.toString() !== recipeId
        );
        recipe.favourites = Math.max(0, recipe.favourites - 1); // Smanji broj omiljenih
      } else {
        user.favouriteRecepies.push(recipeId);
        recipe.favourites += 1; // Povećaj broj omiljenih
      }

      await user.save();
      await recipe.save();

      return res.status(200).json({
        isFavourite: !isFavourite,
        favouritesCount: recipe.favourites,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Ažuriranje korisničkog imena
  updateUsername = async (req: express.Request, res: express.Response) => {
    try {
      const { userId, newUsername } = req.body;

      // Proveri da li korisničko ime već postoji
      const existingUser = await User.findOne({ username: newUsername }).exec();
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      // Dohvati trenutnog korisnika da sačuvaš staro korisničko ime
      const currentUser = await User.findById(userId).exec();
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const oldUsername = currentUser.username; // Sačuvaj staro korisničko ime

      // Ažuriraj korisničko ime
      currentUser.username = newUsername;
      await currentUser.save();

      // Ažuriraj korisničko ime u komentarima
      await Comment.updateMany(
        { username: oldUsername }, // Traži komentare sa starim korisničkim imenom
        { username: newUsername }
      ).exec();

      // Ažuriraj korisničko ime u ocenama
      await Rating.updateMany(
        { username: oldUsername }, // Traži ocene sa starim korisničkim imenom
        { username: newUsername }
      ).exec();

      return res
        .status(200)
        .json({ message: "Username updated successfully", user: currentUser });
    } catch (error) {
      console.error("Error updating username:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Ažuriranje email adrese
  updateEmail = async (req: express.Request, res: express.Response) => {
    try {
      const { userId, newEmail } = req.body;

      // Proveri da li email već postoji
      const existingUser = await User.findOne({ email: newEmail }).exec();
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Ažuriraj email
      const user = await User.findByIdAndUpdate(
        userId,
        { email: newEmail },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Email updated successfully", user });
    } catch (error) {
      console.error("Error updating email:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Ažuriranje imena (firstname)
  updateFirstname = async (req: express.Request, res: express.Response) => {
    try {
      const { userId, newFirstname } = req.body;

      // Ažuriraj ime
      const user = await User.findByIdAndUpdate(
        userId,
        { firstname: newFirstname },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Firstname updated successfully", user });
    } catch (error) {
      console.error("Error updating firstname:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Ažuriranje prezimena (lastname)
  updateLastname = async (req: express.Request, res: express.Response) => {
    try {
      const { userId, newLastname } = req.body;

      // Ažuriraj prezime
      const user = await User.findByIdAndUpdate(
        userId,
        { lastname: newLastname },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Lastname updated successfully", user });
    } catch (error) {
      console.error("Error updating lastname:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // Ažuriranje telefonskog broja
  updatePhone = async (req: express.Request, res: express.Response) => {
    try {
      const { userId, newPhone } = req.body;

      // Ažuriraj telefonski broj
      const user = await User.findByIdAndUpdate(
        userId,
        { phone: newPhone },
        { new: true }
      ).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Phone number updated successfully", user });
    } catch (error) {
      console.error("Error updating phone number:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  adminSearchUsers = async (req: express.Request, res: express.Response) => {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Pretraga po username ili email
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
        role: { $in: ["user", "chef"] },
      })
        .lean()
        .exec();

      return res.status(200).json(users);
    } catch (err) {
      const error = err as Error;
      console.error("Error searching users:", error.message);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  becomeChef = async (req: express.Request, res: express.Response) => {
    const { username } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Update user's role to Chef
      user.role = "chef";
      await user.save();

      // Pronađi sve recepte koje je kreirao korisnik i ažuriraj njihov status na "active"
      await Recipe.updateMany({ createdBy: user._id }, { status: "active" });

      res
        .status(200)
        .json({ success: true, message: "User has become a Chef" });
    } catch (error) {
      console.error("Error in becoming Chef:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
}
