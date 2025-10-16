import prisma from "../../lib/prisma/prisma.js";

export const get_by_email_service = async (email) => {
    const user = await prisma.users.findUnique({
        where: {
            email: email
        },
        include: {
            credential: true
        }
    });

    return user;
};