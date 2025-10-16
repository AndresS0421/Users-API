import prisma from "../../../lib/prisma/prisma.js";

export const update_session = async (session_id, update_data) => {
    const updated_session = await prisma.sessions.update({
        where: {
            id: session_id
        },
        data: update_data
    });

    return updated_session;
};
