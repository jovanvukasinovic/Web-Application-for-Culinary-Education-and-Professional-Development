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
  login = async (req: Request, res: Response) => {
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
  deleteUserByUsername = async (
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
  activateUser = async (req: express.Request, res: express.Response) => {
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
  deactivateUser = async (req: express.Request, res: express.Response) => {
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
}
