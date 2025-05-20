import { randomBytes } from "crypto";

export const generateNumericId = (length = 6) => {
  if (length <= 0) return "";

  let digits = "";
  while (digits.length < length) {
    const bytes = randomBytes(length); // generate more than needed
    const numbersOnly = bytes.toString("hex").replace(/\D/g, ""); // keep digits only
    digits += numbersOnly;
  }

  return digits.slice(0, length);
};
