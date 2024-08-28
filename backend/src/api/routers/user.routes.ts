import express from "express";
import multer from "multer";

import { UserController } from "../controllers/user.controller";

const userRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Kreiranje instance UserController
const userController = new UserController();

// Ruta za prijavu korisnika
userRouter.post("/userLogin", (req, res) => userController.userLogin(req, res));

// Ruta za prijavu administratora
userRouter.post("/adminLogin", (req, res) =>
  userController.adminLogin(req, res)
);

// Ruta za dohvatanje korisnika po korisnickom imenu
userRouter.get("/:username", (req, res) =>
  userController.getUserByUsername(req, res)
);

userRouter.get("/:id", (req, res) => {
  console.log(req.params); // Ovo treba da prikazuje _id
  userController.getUserById(req, res);
});

// Ruta za verifikaciju lozinke
userRouter.post("/getUserByIdPost", (req, res) =>
  userController.getUserByIdPost(req, res)
);

// Ruta za registraciju korisnika (sa uploadom profilne slike)
userRouter.post("/register", upload.single("photo"), (req, res) =>
  userController.userRegistration(req, res)
);

// Ruta za dodavanje korisnika od strane administratora (sa uploadom profilne slike)
userRouter.post("/addUserByAdmin", upload.single("photo"), (req, res) =>
  userController.addUserByAdmin(req, res)
);

// Ruta za verifikaciju lozinke
userRouter.post("/verifyPassword", (req, res) =>
  userController.verifyPassword(req, res)
);

// Ruta za promenu lozinke
userRouter.patch("/changePassword", (req, res) =>
  userController.changePassword(req, res)
);

// Ruta za aktivaciju korisnika od strane administratora
userRouter.patch("/activateUser", (req, res) =>
  userController.activateUserByAdmin(req, res)
);

// Ruta za deaktivaciju korisnika od strane administratora
userRouter.patch("/deactivateUser", (req, res) =>
  userController.deactivateUserByAdmin(req, res)
);

// Ruta za brisanje korisnika od strane administratora
userRouter.delete("/deleteUser", (req, res) =>
  userController.deleteUserByUsernameByAdmin(req, res)
);

// Ruta za proveru dostupnosti korisničkog imena
userRouter.post("/checkUsername", (req, res) =>
  userController.findUsername(req, res)
);

// Ruta za proveru dostupnosti email adrese
userRouter.post("/checkEmail", (req, res) =>
  userController.findEmail(req, res)
);

// Ruta za upload profilne slike
userRouter.post(
  "/uploadProfilePicture/:userId",
  upload.single("photo"),
  (req, res) => userController.uploadProfilePicture(req, res)
);

// Ruta za dobijanje profilne slike korisnika
userRouter.get("/profile-picture/:userId", (req, res) =>
  userController.getProfilePicture(req, res)
);

userRouter.post("/toggle-favourite", (req, res) =>
  userController.toggleFavouriteRecipe(req, res)
);

userRouter.patch("/updateUsername", (req, res) =>
  userController.updateUsername(req, res)
);
userRouter.patch("/updateEmail", (req, res) =>
  userController.updateEmail(req, res)
);
userRouter.patch("/updateFirstname", (req, res) =>
  userController.updateFirstname(req, res)
);
userRouter.patch("/updateLastname", (req, res) =>
  userController.updateLastname(req, res)
);
userRouter.patch("/updatePhone", (req, res) =>
  userController.updatePhone(req, res)
);

export default userRouter;
