import { Router } from "express";
import * as controller from "../controllers/users.controller.js";

const router = Router();

router.route("/:name").get(controller.getUserProfile);

router.route("/wallet").get(controller.getWallet);

export default router;
