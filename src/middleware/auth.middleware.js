import jwt from "jsonwebtoken";

export async function auth_middleware(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new Error("Unauthorized. Authorization header is required.")
        }

        const access_token = req.headers.authorization.split(" ")[1];

        if (!access_token) {
            throw new Error("Unauthorized. Bearer access token is required in headers.")
        }

        const { id, role } = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
        req.auth = { id, role }

        next();
    } catch (e) {
        return res.status(401).json({successful: false, message: e.message});
    }
}