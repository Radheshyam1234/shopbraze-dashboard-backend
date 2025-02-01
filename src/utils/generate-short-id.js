import { nanoid } from "nanoid";

export const generateShortId = (size) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const firstChar = alphabet[Math.floor(Math.random() * alphabet.length)];
  const restId = nanoid(size - 1 || 7);
  return firstChar + restId;
};
