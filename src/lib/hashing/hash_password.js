import bcrypt from "bcrypt";

export const hash_password = async (password) => {
    // Salt rounds
    const salt_rounds = 10;
    // Hash password
    const hash = await bcrypt.hash(password, salt_rounds);

    return hash;
};