import express from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, // <-- 1. Import logoutUser here
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);       // <-- 2. Add the logout route


export default router;