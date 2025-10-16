import prisma from "../../../lib/prisma/prisma.js";

export const get_session_service = async (session_id) => {
    const session = await prisma.sessions.findUnique({
        where: {
            id: session_id
        },
        include: {
            users: true
        }
    });

    return session;
};
