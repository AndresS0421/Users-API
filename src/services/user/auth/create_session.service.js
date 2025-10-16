import prisma from "../../../lib/prisma/prisma.js";

export const create_session_service = async (sessionData) => {
    const session = await prisma.sessions.create({
        data: {
            user_id: sessionData.user_id,
            refresh_id: sessionData.refresh_id,
            expires_at: sessionData.expires_at
        }
    });

    return session;
};
