import express from "express";
import multer from "multer";
import { upload_file_controller } from "../controllers/files/upload.controller.js";
import { get_all_files_controller } from "../controllers/files/get_all.controller.js";
import { get_file_by_id_controller } from "../controllers/files/get_by_id.controller.js";
import { get_files_by_user_id_controller } from "../controllers/files/get_by_user_id.controller.js";
import { update_file_controller } from "../controllers/files/update.controller.js";
import { delete_file_controller } from "../controllers/files/delete.controller.js";
import { auth_middleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only allow PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// File routes
router.route("/upload")
    .post(auth_middleware, upload.single('file'), upload_file_controller);

router.route("/get-all")
    .get(auth_middleware, get_all_files_controller);

router.route("/get")
    .get(auth_middleware, get_file_by_id_controller);

router.route("/get-user-id")
    .get(auth_middleware, get_files_by_user_id_controller);

router.route("/update")
    .put(auth_middleware, upload.single('file'), update_file_controller);

router.route("/delete")
    .delete(auth_middleware, delete_file_controller);

export default router;
