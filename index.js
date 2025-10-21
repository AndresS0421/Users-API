import express from "express";
import dotenv from "dotenv";
import multer from "multer";

import user_router from './src/routes/user.router.js';
import files_router from './src/routes/files.router.js';
import category_router from './src/routes/category.router.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', user_router);
app.use('/files', files_router);
app.use('/category', category_router);

// Error handling middleware for multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    if (error.message === 'Only PDF files are allowed') {
        return res.status(400).json({
            success: false,
            message: 'Only PDF files are allowed'
        });
    }
    
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
    });
});

function onStart() {
    console.log(`Server running on port ${port}`);
}

app.listen(port, onStart);

export default app;