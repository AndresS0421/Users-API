import express from "express";
import { create_category_controller } from "../controllers/category/create.controller.js";
import { get_all_categories_controller } from "../controllers/category/get_all.controller.js";
import { update_category_controller } from "../controllers/category/update.controller.js";
import { delete_category_controller } from "../controllers/category/delete.controller.js";
import { auth_middleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Category routes
router.route("/create")
    .post(auth_middleware, create_category_controller);

router.route("/get-all")
    .get(get_all_categories_controller);

router.route("/update")
    .put(auth_middleware, update_category_controller);

router.route("/delete")
    .delete(auth_middleware, delete_category_controller);

export default router;
