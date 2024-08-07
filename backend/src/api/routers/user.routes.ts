import express from "express";
import { UserController } from "../controllers/user.controller";
import multer from "multer";

const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

userRouter
  .route("/login")
  .post((req, res) => new UserController().login(req, res));

userRouter
  .route("/upload")
  .post(upload.single("photo"), (req, res) =>
    new UserController().uploadProfilePicture(req, res)
  );

userRouter
  .route("/profile-picture/:userId")
  .get((req, res) => new UserController().getProfilePicture(req, res));

export default userRouter;
