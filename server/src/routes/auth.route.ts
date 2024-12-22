import { Router } from "express";

import * as controller from "../controllers/auth.controller.js";

const router = Router();

router.route("/").get(controller.getCurrentSession).patch(controller.updateUser);

router.route("/getuser").get(controller.getCurrentSession);
// create or update guest sessions

router.route("/logout").post(controller.logoutSession);

router.route("/register").post(controller.registerUser);
router.route("/login").post(controller.loginUser);

export default router;
