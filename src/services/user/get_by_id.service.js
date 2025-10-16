import prisma from "../../lib/prisma/prisma.js";

export async function get_by_id_service(id) {
    const user = await prisma.users.findUnique({
        where: {
            id: id
        }
    });

    return user;
}