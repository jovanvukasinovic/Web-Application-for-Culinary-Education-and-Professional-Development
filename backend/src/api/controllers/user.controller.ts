import express, { Request, Response } from "express";
import multer from "multer";
import User from "../models/user";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export class UserController {
  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
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
}
