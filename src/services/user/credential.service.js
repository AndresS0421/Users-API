import prisma from "../../lib/prisma/prisma.js";

export const create_credential_service = async (user_id, hashed_password) => {
    const credential = await prisma.credential.create({
        data: {
            user_id: user_id,
            credential: hashed_password
        }
    });

    return credential;
};
