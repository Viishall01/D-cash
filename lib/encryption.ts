// utils/encryption.ts
import CryptoJS from "crypto-js";

export const encryptAndSave = (mnemonic: string, password: string) => {
  // We use AES encryption. The library handles the IV (Initialization Vector) 
  // and salt automatically when using a password string.
  const ciphertext = CryptoJS.AES.encrypt(mnemonic, password).toString();
  localStorage.setItem("encrypted_vault", ciphertext);
};

export const loadAndDecrypt = (password: string): string | null => {
  const ciphertext = localStorage.getItem("encrypted_vault");
  if (!ciphertext) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption fails or password is wrong, originalText will be empty
    return originalText || null;
  } catch (e) {
    return null; // Invalid password or corrupted data
  }
};