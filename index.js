import express from "express";
import dotenv from "dotenv";

import user_router from './src/routes/user.router.js';

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', user_router);

function onStart() {
    console.log(`Server running on port ${port}`);
}

app.listen(port, onStart);

export default app;