import Cryptr from "cryptr";

const secret = process.env.CRYPTR_SECRET || "your-secret";

export const cryptrInstance = new Cryptr(secret, {
  encoding: "base64",
  pbkdf2Iterations: 500,
  saltLength: 5,
});
