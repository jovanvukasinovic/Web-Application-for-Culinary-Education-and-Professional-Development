import express, { Request, Response } from "express";
import multer from "multer";
import User from "../models/user";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export class UserController {
  // TODO: Not used
  adminLogin = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const admin = await User.findOne({ username, role: "admin" }).exec();

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json(admin);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // TODO: Not used
  userLogin = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await User.findOne({ username, password }).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // TODO: Not used
  uploadProfilePicture = async (req: Request, res: Response) => {
    try {
      const userId = req.body.userId;

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

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // TODO: Not used
  getProfilePicture = async (req: Request, res: Response) => {
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
      return res.status(500).json({ message: "Server error" });
    }
  };

  // TODO: Not used
  getUserByUsername = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.body;

      const user = await User.findOne({ username }).exec();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
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

      const userDeletionResult = await User.deleteOne({ username }).exec();
      if (userDeletionResult.deletedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Brisanje svega što je povezano sa korisnikom
      // await Recipe.deleteMany({ owner: username }).exec();

      return res
        .status(200)
        .json({ message: "User and associated recipes deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  // TODO: Not used
  changePassword = async (req: express.Request, res: express.Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const updateResult = await User.updateOne(
        { username },
        { $set: { password } }
      ).exec();

      if (updateResult.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "User not found or password unchanged" });
      }

      return res.status(200).json({ message: "Password changed" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
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
      return res.status(500).json({ message: "Server error" });
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
      return res.status(500).json({ message: "Server error" });
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
      return res
        .status(400)
        .json({ message: "Error adding user", error: (err as any).message });
    }
  };

  // TODO: Not used
  userRegistration = async (req: express.Request, res: express.Response) => {
    try {
      const { firstname, lastname, username, password, email, phone } =
        req.body;

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
        status: "inactive", // User registration is inactive until approved
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
        message: "Error registering user.",
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
      return res.status(500).json({ message: "Server error." });
    }
  };

  // TODO: Not used
  findMail = async (req: express.Request, res: express.Response) => {
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
      return res.status(500).json({ message: "Server error." });
    }
  };
}
