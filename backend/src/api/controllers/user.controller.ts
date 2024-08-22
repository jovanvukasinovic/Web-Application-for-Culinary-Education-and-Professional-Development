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
  userLogin = async (req: Request, res: Response) => {
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
      return res
        .status(500)
        .json({ message: "Server error: uploadProfilePicture" });
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
      return res
        .status(500)
        .json({ message: "Server error: getProfilePicture" });
    }
  };

  // TODO: Not used
  getUserByUsername = async (req: express.Request, res: express.Response) => {
    try {
      const { username } = req.params;

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
      const { _id } = req.params; // Correctly destructure _id
      console.log("User ID received:", _id);

      const user = await User.findById(_id).exec(); // Use _id to find the user

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error: getUserById" });
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
      return res
        .status(500)
        .json({ message: "Server error: deleteUserByUsernameByAdmin" });
    }
  };

  // Verifikacija lozinke korisnika
  verifyPassword = async (req: Request, res: Response) => {
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
  changePassword = async (req: Request, res: Response) => {
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
}
