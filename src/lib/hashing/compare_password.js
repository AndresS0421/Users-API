import bcrypt from "bcrypt";

export const compare_password = async (password, hashed_password) => {
    const is_valid = await bcrypt.compare(password, hashed_password);

    return is_valid;
};