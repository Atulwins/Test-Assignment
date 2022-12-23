import * as bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  return hashedPassword;
};

export const comparePassword = async (password, currentPassword) => {
  return await bcrypt.compare(password, currentPassword);
};
