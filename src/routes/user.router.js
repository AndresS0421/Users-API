import express from "express";
import { create_controller } from "../controllers/user/create.controller.js";
import { login_controller } from "../controllers/user/login.controller.js";
import { refresh_token_controller } from "../controllers/user/refresh_token.controller.js";
import { register_admin_controller } from "../controllers/user/register_admin.controller.js";
import { register_auditor_controller } from "../controllers/user/register_auditor.controller.js";

const router = express.Router();

router.route("/create")
    .post(create_controller);

router.route("/register-admin")
    .post(register_admin_controller);

router.route("/register-auditor")
    .post(register_auditor_controller);

router.route("/login")
    .post(login_controller);

router.route("/refresh-token")
    .post(refresh_token_controller);

export default router;